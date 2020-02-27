import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Range } from 'rc-slider';
import { years as rawYears } from '../../../searchAssets.json';
import 'rc-slider/assets/index.css';
import './yearInput.css';

const years = rawYears
    .map(year => parseInt(year))
    .sort(); // Should be sorted, but sort anyways in case of any change to searchAssets.

// Min and max values to determine number of increments on slider.
const MIN = 0;
const MAX = years.length - 1;

// For input text box that controls sliders.
class YearInputTextBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '', // Input string.
            willCheck: null, // Timeout used for checking errors.
        }
    }

    /** Clean up STO on unmount, if exists. */
    componentWillUnmount() {
        const { willCheck } = this.state;
        
        if (willCheck) clearTimeout(willCheck);
    }

    /**
     * Validate an input.
     * This function waits a second before reporting an error back to parent component.
     * Logic for this setTimeout exists in the setState for willCheck.
     * @param {string} value - value from text input.
     */
    validateInput = (value) => {
        const { updateInput, setError, min, max } = this.props;

        // Check if inputted text is a valid (-)YYYY(BC) matching string.
        if (value && value.match(/^-?[0-9]*([\s]?BC)?$/)) {
            setError(false); // Update error to be false in parent component.

            let yearValue = parseInt(value.match(/[0-9]*$/)[0]);  // Get value from string.
            if (value.includes('-') || value.includes('BC')) yearValue = yearValue * -1; // If year is BC, invert it.

            // Find the next highest item in the array of years.
            const nextYearIndex = years.findIndex(year => year >= yearValue);

            // A. If the next index is the max possible value or past the value. 
            if (
                (nextYearIndex > max || nextYearIndex === -1) &&
                value > years[max]
            ) {
                updateInput(max, years[max]);
            // B. If the value is below our designated floor, min.
            } else if (nextYearIndex <= min) {
                updateInput(min, years[min]);

            // C. => Calculate where index will land according to comparison of difference of value to next index value
            // to difference between two closest indexes.
            // e.g. 1913 has a nextIndex value of 1915 which has a lower bound of 1910. (1915-1913)/(1915-1910) = 0.4.
            } else {
                const indexDifference = 1 - ((years[nextYearIndex] - value)/(years[nextYearIndex] - years[nextYearIndex - 1]));
                updateInput(nextYearIndex - 1 + indexDifference, value);
            }
            

        } else {
            // If the inputted text is not a valid date, set up callback to check state in a few MS.
            // This prevents bombarding a user with errors immediately.
            this.setState({
                willCheck: setTimeout(() => {
                    const { value: nextValue } = this.state; // Get next value from state.

                    // Check if nextValue still does not match.
                    if (!nextValue.match(/^-?[0-9]*([\s]?BC)?$/)) {
                        setError(true);
                    }
                }, 1000)
            });

        }

        this.setState({ value })
    };

    render() {
        return (
            <input
                type='text'
                className='year-input__text-input'
                onChange={({ target: { value }}) => this.validateInput(value)}
            />
        )
    }
}

class YearInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // For input range.
            beginDateIndex: MIN,
            endDateIndex: MAX,

            beginDate: years[MIN],
            endDate: years[MAX],
            
            // For alerts about bad inputs.
            isError: false,
        };
    }

    /** Set up initial slider values. */
    componentDidMount() {
        const { appliedYears } = this.props;

        if (appliedYears && appliedYears.dateRange && appliedYears.dateRange.term) {
            // If for whatever reason property does not exist, default to constant.
            this.setState({
                beginDateIndex: appliedYears.dateRange.term.beginDateIndex || MIN,
                endDateIndex: appliedYears.dateRange.term.endDateIndex || MAX,
                beginDate: appliedYears.dateRange.term.beginDate || years[MIN],
                endDate: appliedYears.dateRange.term.endDate || years[MAX],
            });
        }
    }

    /**
     * Update error state of inputs.
     * @param {boolean} isError - error state of either input.
     */
    setError = isError => this.setState({ isError });

    /**
     * Generate YYYY —— YYYY string for given indexes.
     * @param {{beginDateIndex: number, endDateIndex: number}?} options - optional object to generate formatted year string with.
     * @returns {string} formatted date string for header and active filter pill.
     */
    getFormattedYearsString({ beginDate, endDate } = this.state) {
        // Map over for formatting.
        const [beginDateFormat, endDateFormat] = [beginDate, endDate].map((value) => {
            if (value < 0) return `${value * -1} BC`;
            if (value >= 1960) return 'Present';
            return value;
        });

        return `${beginDateFormat} — ${endDateFormat}`;
    }

    /**
     * Update state for slider presentation and parents applied years.
     * @param {beginDateIndex: number, endDateIndex: number} - indexes of years array to be sent to parent.
     */
    updateSlider = ({ beginDateIndex, endDateIndex }) => {
        const { setActiveTerm, isDropdown } = this.props;

        if (!isDropdown) {
            // Update parent state.
            setActiveTerm({
                beginDateIndex,
                endDateIndex,
                beginDate: years[beginDateIndex],
                endDate: years[endDateIndex],
                formattedYearsString: this.getFormattedYearsString({
                    beginDateIndex: years[beginDateIndex],
                    endDateIndex: years[endDateIndex],
                }),
            }); 
        }

        // Update local state.
        this.setState({
            beginDateIndex,
            endDateIndex,
            beginDate: years[beginDateIndex],
            endDate: years[endDateIndex],
        }); 
    }

    /**
     * Update text input.
     * @param {[indexAndDates: string]: number}
     */
    updateInput = ({ beginDateIndex, beginDate, endDate, endDateIndex }) => {
        // Callback as argument after update.
        const callback = () => {
            const { beginDateIndex, beginDate, endDate, endDateIndex } = this.state;
            const { setActiveTerm } = this.props;

            setActiveTerm({
                beginDateIndex,
                endDateIndex,
                beginDate,
                endDate,
                formattedYearsString: this.getFormattedYearsString({ beginDate, endDate }),
            })
        };

        if ((beginDateIndex || beginDateIndex === 0) && (beginDate || beginDate === 0) && beginDate < this.state.endDate) {
            this.setState({ beginDateIndex, beginDate }, callback);
        }
        if ((endDateIndex || endDateIndex === 0) && (endDate || endDate === 0) && endDate > this.state.beginDate) {
            this.setState({ endDate, endDateIndex }, callback);
        }
    }

    /**
     * Click apply button, this is a method for large screen devices.
     */
    apply = () => {
        const {
            beginDateIndex,
            endDateIndex,
            beginDate,
            endDate,
        } = this.state;
        const { setActiveTerm } = this.props;

        // Update parent state.
        setActiveTerm({
            beginDateIndex,
            endDateIndex,
            beginDate,
            endDate,
            formattedYearsString: this.getFormattedYearsString()
        }); 
    }

    render() {
        const { beginDateIndex, beginDate, endDate, endDateIndex, isError } = this.state;
        const { isDropdown, appliedYears } = this.props;

        let useApplyCallback = true; // Boolean indicating if callback should execute application.

        // Check if there is any applied dates in redux store.
        if (appliedYears && appliedYears.dateRange && appliedYears.dateRange.term) {
            // Destructure dates from redux.
            const { dateRange: { term: { beginDate: beginDatePrevious, endDate: endDatePrevious }}} = appliedYears;

            // If dates don't match, allow for application.
            if (beginDate === beginDatePrevious && endDate === endDatePrevious) {
                useApplyCallback = false;
            }
        }

        // BEM modifier contingent on if apply should be clickable.
        const buttonClass = `btn ${useApplyCallback ? 'btn--primary' : 'btn--disabled'}`

        return (
            <div className='year-input'>
                <div className='year-input__header'>{this.getFormattedYearsString()}</div>
                <div className='component-slider year-input__slider'>
                    <Range
                        min={MIN}
                        max={MAX}
                        className='slider'
                        allowCross={false}
                        pushable={1}
                        defaultValue={[MIN, MAX]}
                        onChange={([beginDateIndex, endDateIndex]) => this.updateSlider({ beginDateIndex, endDateIndex })}
                        value={[beginDateIndex, endDateIndex]}
                    />
                </div>
                <div className='year-input__bottom'>
                    <div className='year-input__header color-light'>Custom range</div>
                    {isError &&
                        <div className='form-field__error form-field__error--summary year-input__error'>
                            Please enter a valid year.
                        </div>
                    }
                    <div className='year-input__text-input-group'>
                        <YearInputTextBox
                            min={MIN}
                            max={endDateIndex}
                            updateSlider={beginDateIndex => this.updateSlider({ beginDateIndex, endDateIndex })}
                            updateInput={(beginDateIndex, beginDate) => this.updateInput({ beginDateIndex, beginDate })}
                            setError={this.setError}
                            value={beginDate}
                        />
                        <YearInputTextBox
                            min={beginDateIndex}
                            max={MAX}
                            updateSlider={endDateIndex => this.updateSlider({ beginDateIndex, endDateIndex })}
                            updateInput={(endDateIndex, endDate) => this.updateInput({ endDateIndex, endDate })}
                            setError={this.setError}
                            value={endDate}
                        />
                    </div>
                    {/** We only need manual application for large screens w/ traditional dropdowns. */}
                    {isDropdown && 
                        <button
                            className={`${buttonClass} year-input__button`}
                            onClick={useApplyCallback ? this.apply : null}
                        >
                                Apply
                        </button>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ appliedYears: state.filters.advancedFilters.Year });
const connectedYearInput = connect(mapStateToProps)(YearInput);
export { connectedYearInput as YearInput };
