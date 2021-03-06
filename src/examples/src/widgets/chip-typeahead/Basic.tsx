import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '@dojo/widgets/examples/src/widgets/list/states';
import Example from '../../Example';
import { createResource, createMemoryTemplate, defaultFilter } from '@dojo/framework/core/resource';

const factory = create();

const resource = createResource(createMemoryTemplate({ filter: defaultFilter }));

export default factory(function Basic() {
	return (
		<Example>
			<ChipTypeahead resource={resource(states)} transform={defaultTransform}>
				{{
					label: 'Select All States That Apply'
				}}
			</ChipTypeahead>
		</Example>
	);
});
