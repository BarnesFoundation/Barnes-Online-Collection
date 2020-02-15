import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from '../Icon';
import { selectFilterSet } from '../../actions/filterSets';

const CollectionFiltersMenuItem = ({ selectFilterSet, slug, svgId, title, visibleFilterSet }) => {
  let filterClassNames = 'btn-collection-filter font-zeta color-light';
  if (slug === 'search') filterClassNames = `${filterClassNames} btn-collection-filter--search`;
  if (slug === 'shuffle') filterClassNames = `${filterClassNames} btn-collection-filter--shuffle`;
  if (slug === visibleFilterSet) filterClassNames = `${filterClassNames} is-selected`;

  return (
    <button
      className={filterClassNames}
      onClick={() => selectFilterSet(slug)}
    >
      <div className='button-inner'>
        <div className='button-inner__content'>
          <Icon svgId={svgId} classes='collection-filter-icon' />
            <span className='button-inner__text'>{title}</span>
        </div>
      </div>
    </button>
  );
}

const mapStateToProps = (state) => ({ visibleFilterSet: state.filterSets.visibleFilterSet });
const mapDispatchToProps = (dispatch) => (bindActionCreators(Object.assign({}, { selectFilterSet }), dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFiltersMenuItem);
