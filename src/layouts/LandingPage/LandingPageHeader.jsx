import React, { Component } from 'react';

export default () => (
  <div className='o-hero o-hero--landing-page'>
    <div className='o-hero__inner'>
      <div
        className='container o-hero__container'
      >
        <div className='o-hero__copy'>
          <p className='o-hero__supporting'>The minute you step into the galleries of the Barnes collection, you know you're in for an experience like no other.</p>
        </div>
      </div>
    </div>
    <picture>
      <source
        media='(min-width: 990px)'
        srcSet='https://barnesfoundation.imgix.net/sharedBackgroundImages/Personalized-Docent-Tour_190122_145459.jpg?crop=faces&amp;fit=crop&amp;fm=pjpg&amp;fp-x=0.5&amp;fp-y=0.5&amp;h=800&amp;ixlib=php-2.1.1&amp;w=1380' type='image/jpeg' />
      <source
        media='(min-width: 650px)'
        srcSet='https://barnesfoundation.imgix.net/sharedBackgroundImages/Personalized-Docent-Tour_190122_145459.jpg?crop=faces&amp;fit=crop&amp;fm=pjpg&amp;fp-x=0.5&amp;fp-y=0.5&amp;h=574&amp;ixlib=php-2.1.1&amp;w=880' type='image/jpeg' />
      <img
        className='o-hero__image'
        src='https://barnesfoundation.imgix.net/sharedBackgroundImages/Personalized-Docent-Tour_190122_145459.jpg?crop=faces&amp;fit=crop&amp;fm=pjpg&amp;fp-x=0.5&amp;fp-y=0.5&amp;h=380&amp;ixlib=php-2.1.1&amp;w=380'
        alt='' />
    </picture>
  </div>
);
