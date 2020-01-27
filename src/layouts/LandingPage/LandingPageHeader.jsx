import React, { Component } from 'react';

class LandingPageHeader extends Component {
  render() {
    return (
      <div className='o-hero o-hero--landing-page'>
        <div className='o-hero__inner'>
          <div className='container o-hero__container'>
            <div className='o-hero__copy'>
              <p className='o-hero__supporting'>The minute you step into the galleries of the Barnes collection, you know you're in for an experience like no other.</p>
            </div>
          </div>
        </div>
      </div>
      // <h2 className="landing-page-header h2 font-gamma">Albert Barnes taught people to look at works <br className="large-only"/>of art primarily in terms of their visual relationships.</h2>
    );
  }
}

export default LandingPageHeader;
