import React, { Component } from 'react';
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

export class YearInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // For input range.
            beginDateIndex: MIN + 9,
            endDateIndex: MAX - 7,
            
            // For alerts about bad inputs.
            isError: false,
        };
    }

    /**
     * Update error state of inputs.
     * @param {boolean} isError - error state of either input.
     */
    setError = isError => {
        this.setState({ isError })
    };

    /**
     * Update state for slider presentation and parents applied years.
     * @param {beginDateIndex: number, endDateIndex: number} - indexes of years array to be sent to parent.
     */
    updateSlider = ({ beginDateIndex, endDateIndex }) => {
        const { setActiveTerm } = this.props;

        setActiveTerm({ beginDate: years[beginDateIndex], endDate: years[endDateIndex] }); // Update parent state.
        this.setState({ beginDateIndex, endDateIndex }); // Update local state.
    }

    render() {
        const { beginDateIndex, endDateIndex, isError } = this.state;

        const [beginDate, endDate] = [beginDateIndex, endDateIndex]
            .map((value) => {
                if (value === MIN) return '4000 BC';
                if (value === MAX) return 'Present';
                return years[value];
            });
        const yearRange = `${beginDate}-${endDate}`;

        return (
            <div className='year-input'>
                <div className='year-input__header'>{yearRange}</div>
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
                <div className='year-input__header color-light'>Custom range</div>
                {isError &&
                    <div className='form-field__error form-field__error--summary'>
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
            </div>
        )
    }
}
