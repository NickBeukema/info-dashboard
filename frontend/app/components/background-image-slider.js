import Ember from 'ember';

export default Ember.Component.extend({
  duration: 25000,
  fadeDuration: 4000,

  imageSelector: '.background-slider__image',
  activeImageSelector: '.background-slider__image--active',

  imageClass: 'background-slider__image',
  activeImageClass: 'background-slider__image--active',
  fadingInClass: 'background-slider__image--fading-in',

  imageArray: Ember.computed(function() {
    return Array.from({ length: 14 }).map((_,idx) => {
      return idx + 1;
    });
  }),

  getAllImages() {
    return this.$(this.get('imageSelector'));
  },

  didInsertElement() {
    this.setupImages();
    this.startSlider();
  },


  setupImages() {
    let photo = this.getAllImages().first();
    this.activatePhoto(photo);
  },

  activatePhoto(photo) {
    let currentPhoto = this.$(this.get('activeImageSelector'));
    photo.addClass(this.get('fadingInClass'));

    setTimeout(() => {

      currentPhoto.removeClass(this.get('activeImageClass'));

      photo.addClass(this.get('activeImageClass'))
        .removeClass(this.get('fadingInClass'));

    }, this.get('fadeDuration'));
  },

  startSlider() {
    setTimeout(this.animatePhoto.bind(this), this.get('duration'));
  },
  animatePhoto() {
    let currentPhoto = this.$(this.get('activeImageSelector'));
    let nextPhoto = currentPhoto.next();

    if(nextPhoto.length === 0) {
      nextPhoto = this.getAllImages().first();
    }

    this.activatePhoto(nextPhoto);

    setTimeout(this.animatePhoto.bind(this), this.get('duration'));
  }
});
