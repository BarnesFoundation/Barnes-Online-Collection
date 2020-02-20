import React, { Component } from 'react';
import { years } from '../../../searchAssets.json'; 
import './yearInput.css';

const SLIDERS = {
    MIN: 'MIN',
    MAX: 'MAX',
};

export class YearInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minValue: 0,
            maxValue: years.length - 1,
            pivot: Math.floor(years.length/2),
        }
    }

    /** Update a slider value
    * @param {string} slider - Slider name, @see SLIDERS.
    * @param {number} value - new value for designated slider.  
    */
    updateSlider = (slider, value) => {
        const { minValue, maxValue, pivot } = this.state;

        let newPivot;
        let newMinValue;
        let newMaxValue;

        if (slider === SLIDERS.MIN) {
            if (value >= pivot) {
                newPivot = Math.min(pivot + 1, years.length - 1);
            }

            if (value > maxValue) {
                newMaxValue = maxValue + 1;
            }

            this.setState({
                minValue: Math.min(value, years.length - 1),
                maxValue: newMaxValue || maxValue,
                pivot: newPivot || pivot
            });
        } else if (slider === SLIDERS.MAX) {
            if (value <= pivot) {
                newPivot = Math.max(pivot - 1, 1);
            }

            if (value < minValue) {
                newMinValue = minValue - 1;
            }

            this.setState({
                maxValue: Math.max(value, 0),
                minValue: newMinValue || minValue,
                pivot: newPivot || pivot
            });
        }
    }

    render() {
        const { minValue, maxValue, pivot } = this.state;

        const minWidth = Math.min(((minValue + 1)/years.length) * 100, 90);
        const maxWidth = Math.max(100 - (((minValue + 1)/years.length) * 100), 10);

        return (
            <div>
                <input
                    type='range'
                    min={0}
                    max={Math.min(minValue + 1, years.length - 1)}
                    value={minValue}
                    className='year-input'
                    style={{ width: `${Math.max(minWidth, 10)}%` }}
                    onChange={({ target: { value }}) => this.updateSlider(SLIDERS.MIN, parseInt(value))}
                />
                <input
                    type='range'
                    min={minValue + 1}
                    max={years.length - 1}
                    value={maxValue}
                    className='year-input'
                    style={{ width: `${Math.min(maxWidth, 90)}%` }}
                    onChange={({ target: { value }}) => this.updateSlider(SLIDERS.MAX, parseInt(value))}
                />
            </div>
        );
    }
}