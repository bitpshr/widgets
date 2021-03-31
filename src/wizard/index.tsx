import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult, WNode } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import Icon from '../icon';
import * as css from '../theme/default/wizard.m.css';
import * as avatarCss from '../theme/default/avatar.m.css';
import Avatar from '../avatar';

export interface StepWidgetProperties {
	description?: RenderResult;
	status?: StepStatus;
	subTitle?: RenderResult;
	title?: RenderResult;
}

const stepFactory = create()
	.properties<StepWidgetProperties>()
	.children<RenderResult>();

export const Step = stepFactory(function Step({ children }) {
	return children();
});

export interface WizardProperties {
	/** A callback that will be notified when a step is clicked if this is clickable */
	onStep?(step: number): void;
	/** Direction for steps. Defaults to horizontal */
	direction?: 'horizontal' | 'vertical';
	/** Indicates whether steps should respond to clicks. Defaults to false */
	clickable?: boolean;
	/** The active step can be controlled to automatically set step status. Will be overridden by statuses provided to each step. If this property is not used, individual statuses should be passed to steps */
	activeStep?: number;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete' | 'error';

const factory = create({ theme })
	.properties<WizardProperties>()
	.children<WNode | WNode[]>();

export default factory(function Wizard({ properties, children, middleware: { theme } }) {
	const themedCss = theme.classes(css);
	const {
		activeStep,
		direction = 'horizontal',
		onStep,
		clickable = false,
		classes,
		variant,
		theme: themeProp
	} = properties();

	const [...steps] = children();

	const stepWrappers = steps.map((step, index) => {
		let content;
		let defaultStatus: StepStatus | undefined;

		if (activeStep === undefined) {
			defaultStatus = undefined;
		} else if (activeStep > index) {
			defaultStatus = 'complete';
		} else if (activeStep < index) {
			defaultStatus = 'pending';
		} else {
			defaultStatus = 'inProgress';
		}

		const {
			description,
			status = defaultStatus,
			subTitle,
			title
		} = step.properties as StepWidgetProperties;

		switch (status) {
			case 'complete':
				content = (
					<Icon type="checkIcon" theme={themeProp} classes={classes} variant={variant} />
				);
				break;
			case 'error':
				content = (
					<Icon type="closeIcon" theme={themeProp} classes={classes} variant={variant} />
				);
				break;
			default:
				content = String(index + 1);
		}

		return {
			content: (
				<virtual>
					<div classes={themedCss.stepIcon}>
						<Avatar
							theme={theme.compose(
								avatarCss,
								css,
								'avatar'
							)}
							classes={classes}
							variant={variant}
							outline={Boolean(status !== 'inProgress')}
						>
							{content}
						</Avatar>
					</div>
					<div classes={[theme.variant(), themedCss.stepContent]}>
						<div
							classes={[
								themedCss.stepTitle,
								!title && themedCss.noTitle,
								!description && themedCss.noDescription
							]}
						>
							{title}
							<div classes={themedCss.stepSubTitle}>{subTitle}</div>
						</div>
						<div classes={themedCss.stepDescription}>{description}</div>
						{step}
					</div>
				</virtual>
			),
			status
		};
	});

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				direction === 'horizontal' ? themedCss.horizontal : themedCss.vertical,
				clickable && themedCss.clickable
			]}
		>
			{stepWrappers.map(({ content, status }, index) => (
				<div
					key={`step${index + 1}`}
					classes={[
						themedCss.step,
						status === 'complete' && themedCss.complete,
						status === 'pending' && themedCss.pending,
						status === 'error' && themedCss.error
					]}
					onclick={() => {
						if (clickable && onStep) {
							onStep(index);
						}
					}}
				>
					<div classes={themedCss.tail} />
					{content}
				</div>
			))}
		</div>
	);
});
