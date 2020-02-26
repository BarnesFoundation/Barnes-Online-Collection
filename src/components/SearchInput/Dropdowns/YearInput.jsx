import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Range } from 'rc-slider';
import { years as rawYears } from '../../../searchAssets.json';
import 'rc-slider/assets/index.css';
import './yearInput.css';

const years = rawYears
    .map(year => parseInt(year))
    .sort(); // Should be sorted, but sort anyways.

const MIN = 0;
const MAX = years.length - 1;

// For input text box that controls sliders.
class YearInputTextBox extends Component {
    constructor(props) {
        super(props);

        // Get floor and ceiling for validating input.
        const { isMin } = this.props;
        
        this.min = isMin ? MIN : MIN + 1;
        this.max = isMin ? MAX - 1 : MAX;

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
        const { updateSlider, setError } = this.props;

        if (value.match(/^-?[0-9]*([\s]?BC)?$/)) {
            setError(false); // Update error to be false in parent component.

            let [yearValue] = value.match(/[0-9]*$/);  // Get value from string.
            if (value.includes('-') || value.includes('BC')) yearValue = yearValue * -1; // If year is BC, invert it.

            // Map matching strings to their respective array index and calculate position from there.
            const rangeIndexBase = Math.max(years.findIndex(year => year >= yearValue), this.min);

            if (rangeIndexBase > this.max || rangeIndexBase === -1) {
                updateSlider(this.max);
            } else if (rangeIndexBase < this.min) {
                updateSlider(this.min);
            } else {
                updateSlider(rangeIndexBase);
            }
        } else {
            // If this doesn't match, set up callback to check state in a few MS.
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
            
            // For alerts about bad inputs.
            isError: false,
        };
    }

    /** Set up initial slider values. */
    componentDidMount() {
        const { appliedYears } = this.props;

        console.log(appliedYears);
        if (appliedYears && appliedYears.dateRange && appliedYears.dateRange.term) {
            // If for whatever reason property does not exist, default to constant.
            this.setState({
                beginDateIndex: appliedYears.dateRange.term.beginDateIndex || MIN,
                endDateIndex: appliedYears.dateRange.term.endDateIndex || MAX,
            })
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
    getFormattedYearsString({ beginDateIndex, endDateIndex } = this.state) {

        // Map slider index to corresponding value in years array.
        const [beginDate, endDate] = [beginDateIndex, endDateIndex].map(value => years[value]);

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
            setActiveTerm({
                beginDateIndex,
                endDateIndex,
                beginDate: years[beginDateIndex],
                endDate: years[endDateIndex],
                formattedYearsString: this.getFormattedYearsString({ beginDateIndex, endDateIndex })
            }); // Update parent state.
        }
        this.setState({ beginDateIndex, endDateIndex }); // Update local state.
    }

    /**
     * Click apply button, this is a method for large screen devices.
     */
    apply = () => {
        const { beginDateIndex, endDateIndex } = this.state;
        const { setActiveTerm } = this.props;

        // Update parent state.
        setActiveTerm({
            beginDateIndex,
            endDateIndex,
            beginDate: years[beginDateIndex],
            endDate: years[endDateIndex],
            formattedYearsString: this.getFormattedYearsString()
        }); 
    }

    render() {
        const { beginDateIndex, endDateIndex, isError } = this.state;
        const { isDropdown, appliedYears } = this.props;

        // Get string that appears above slider.
        const formattedYearsString = this.getFormattedYearsString(); 

        // Check redux store for applied years.
        // If the applied years match our current years, do not allow clicking.
        const [beginDate, endDate] = [beginDateIndex, endDateIndex].map(value => years[value]); // Get dates from state index map.

        let buttonClass = 'btn';
        let useApplyCallback = true; // Boolean indicating if callback should execute application.

        // Check if there is any applied dates in redux store.
        // TODO => Clean this up to only use useApplyCallback and not modify a string.
        if (appliedYears && appliedYears.dateRange && appliedYears.dateRange.term) {
            const { dateRange: { term: { beginDate: beginDatePrevious, endDate: endDatePrevious }}} = appliedYears;

            // If dates don't match, allow for application.
            if (beginDate !== beginDatePrevious || endDate !== endDatePrevious) {
                buttonClass = `${buttonClass} btn--primary`;
            } else {
                buttonClass = `${buttonClass} btn--disabled`;
                useApplyCallback = false;
            }

        // If there is no appliedYears data in the redux state, always allow for application.
        // TODO => Fix this to include initial range of all dates, ie (4000BC - Present).
        } else {
            buttonClass = `${buttonClass} btn--primary`;
        }

        return (
            <div className='year-input'>
                <div className='year-input__header'>{formattedYearsString}</div>
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
                            isMin
                            updateSlider={beginDateIndex => this.updateSlider({ beginDateIndex, endDateIndex })}
                            setError={this.setError}
                        />
                        <YearInputTextBox
                            updateSlider={endDateIndex => this.updateSlider({ beginDateIndex, endDateIndex })}
                            setError={this.setError}
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
