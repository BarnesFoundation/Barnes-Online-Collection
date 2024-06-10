import React, { Component } from "react";

import check from "../../components-barnes-toolkit/icons/icon_check.svg";
import down_gray from "../../components-barnes-toolkit/images/down_gray_1x.png";
import down_white from "../../components-barnes-toolkit/images/down_wht_1x.png";
import up_gray from "../../components-barnes-toolkit/images/up_gray_1x.png";
import up_white from "../../components-barnes-toolkit/images/up_wht_1x.png";
import "./dropDownSelector.css";

/**
 *
 */
const DROP_UP = "UP";
const DROP_DOWN = "DOWN";

export default class DropDownSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listVisible: false,
    };
  }

  onClick = (item) => {
    this.props.handleSelectItem(item);
  };

  show = () => {
    this.setState({ listVisible: true });
    document.addEventListener("click", this.hide);
  };

  hide = () => {
    this.setState({ listVisible: false });
    document.removeEventListener("click", this.hide);
  };

  getDropdownIcon = (dir) => {
    if (this.props.isStoryItemDropDown) {
      return dir === DROP_UP ? up_white : down_white;
    } else {
      return dir === DROP_UP ? up_gray : down_gray;
    }
  };

  render = () => {
    return (
      <div className="dd-wrapper">
        <div
          className="dd-header"
          aria-haspopup="true"
          id={this.props.id}
          onClick={this.show}
        >
          <div className="dd-header-title" aria-labelledby={this.props.id}>
            {this.props.selectedItem}
          </div>
          {this.state.listVisible ? (
            <span>
              <img src={this.getDropdownIcon(DROP_UP)} aria-hidden={true} />
            </span>
          ) : (
            <span>
              <img src={this.getDropdownIcon(DROP_DOWN)} aria-hidden={true} />
            </span>
          )}
        </div>
        {this.state.listVisible && (
          <ul className="dd-list">
            {this.props.options.map((item) => (
              <li
                className="dd-list-item"
                key={item}
                onClick={() => this.onClick(item)}
              >
                <span className="select-s">{item}</span>
                {item === this.props.selectedItem && (
                  <img
                    src={check}
                    alt="Gray checkmark indicating current selection"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
}
