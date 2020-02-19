import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { closeFilterSet } from '../../../actions/filterSets';
import { BREAKPOINTS } from '../../../constants';

const DropdownApply = ({ closeFilterSet, isApply, apply, clear }) => {
    const buttonClass = `btn ${isApply ? 'btn--primary' : 'btn--disabled'}`;

    return (
        <MediaQuery maxDeviceWidth={BREAKPOINTS.mobile_max}>
            <div className='dropdown-apply-section'>
                <div>
                    <btn
                        className={`${buttonClass} dropdown-apply-section__button`}
                        onClick={isApply ? apply : null}
                    >
                        Apply
                    </btn>
                </div>
                <div>
                    <btn
                        className='btn dropdown-apply-section__button dropdown-apply-section__button--cancel'
                        onClick={closeFilterSet}
                    >
                        Cancel
                    </btn>
                </div>
            </div>
        </MediaQuery>
    );
};

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, { closeFilterSet }), dispatch);
const ConnectedDropdownApply = connect(null, mapDispatchToProps)(DropdownApply);
export { ConnectedDropdownApply as DropdownApply };
