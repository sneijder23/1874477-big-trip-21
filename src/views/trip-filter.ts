import AbstractView from '../framework/view/abstract-view';
import { FILTER_TYPES } from '../const';
import { FilterType } from '../types-ts';
import { capitalizeFirstLetter } from '../utils/utils';

const createFilterItemTemplate = (filter: FilterType, disabled = false, currentFilter: FilterType) =>
	/*html*/`<div class="trip-filters__filter">
	<input id="filter-${filter}" class="trip-filters__filter-input visually-hidden" type="radio"
	name="trip-filter" value="${filter}" ${currentFilter === filter ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
	<label class="trip-filters__filter-label" for="filter-${filter}">${capitalizeFirstLetter(filter)}</label>
</div>`;

function createFilterTemplate(disabled: FilterType[], currentFilter: FilterType) {
	return (
	/*html*/`<form class="trip-filters" action="#" method="get">
  ${FILTER_TYPES.map((filter) => createFilterItemTemplate(filter, disabled.includes(filter), currentFilter)).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
	);
}

export default class TripFilterView extends AbstractView<HTMLElement> {
	#currentFilter: FilterType;
	#onFilterChange: (filter: FilterType) => void;
	#disabledFilters: FilterType[];

	constructor({ currentFilter, onFilterChange, disabledFilters = [] }: {
		currentFilter: FilterType;
		onFilterChange: (filter: FilterType) => void;
		disabledFilters?: FilterType[];
	}) {
		super();
		this.#currentFilter = currentFilter;
		this.#onFilterChange = onFilterChange;
		this.#disabledFilters = disabledFilters;

		this.element.addEventListener('change', this.#handleFilterChange);
	}

	get template() {
		return createFilterTemplate(this.#disabledFilters, this.#currentFilter);
	}

	#handleFilterChange = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		this.#onFilterChange(target.value as FilterType);
	};
}

