import { render, replace, remove } from '../framework/render';
import TripFilterView from '../views/trip-filter';
import { FILTER_TYPES, FilterType, UpdateType, FILTER_FUNCTIONS } from '../const';
import FilterModel from '../model/filter';
import PointsModel from '../model/trip';

export default class FilterPresenter {
	#filterComponent: TripFilterView | null = null;
	#filterContainer: HTMLElement | null = null;
	#pointsModel: PointsModel | null = null;
	#filterModel: FilterModel | null = null;
	#currentFilter: FilterType = FILTER_TYPES[0];

	constructor({ filterContainer, filterModel, pointsModel }: { filterContainer: HTMLElement, filterModel: FilterModel, pointsModel: PointsModel }) {
		this.#filterContainer = filterContainer;
		this.#filterModel = filterModel;
		this.#pointsModel = pointsModel;

		this.#filterComponent = null;

		this.#pointsModel.addObserver(this.#handleModelEvent);
		this.#filterModel.addObserver(this.#handleModelEvent);
	}

	get filters() {
		const points = this.#pointsModel!.points;
		const disabledFilters: FilterType[] = [];

		const filters = Object.values(FILTER_TYPES).map((type) => {
			const count = FILTER_FUNCTIONS[type](points).length;

			if (count === 0) {
				disabledFilters.push(type);
			}

			return {
				type,
				count,
			};
		});

		return { filters, disabledFilters };
	}

	init() {
		const prevFilterComponent = this.#filterComponent;
		const { disabledFilters } = this.filters;

		this.#filterComponent = new TripFilterView({
			currentFilter: this.#currentFilter,
			onFilterChange: this.#handleFilterTypeChange,
			disabledFilters: disabledFilters,
		});

		if (prevFilterComponent === null) {
			render(this.#filterComponent, this.#filterContainer!);
			return;
		}

		replace(this.#filterComponent, prevFilterComponent);
		remove(prevFilterComponent);
	}

	#handleFilterTypeChange = (filterType: FilterType) => {
		if (this.#filterModel!.filter === filterType) {
			return;
		}

		this.#currentFilter = filterType;
		this.#filterModel!.setFilter(UpdateType.MAJOR, filterType);
	};

	#handleModelEvent = () => {
		this.init();
	};
}

