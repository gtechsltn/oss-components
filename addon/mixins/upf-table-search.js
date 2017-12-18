import Ember from 'ember';

const {
  Mixin,
  computed,
  defineProperty,
  get
} = Ember;

export default Mixin.create({
  searchCollection: 'model',
  searchQuery: '',

  init() {
    this._super();
    defineProperty(
      this,
      'filteredCollection',
      computed('searchQuery', this.get('searchCollection'), function() {
        let searchWords = this.get('searchQuery').split(' ').map(x => x.toLowerCase());
        let collection = get(this, this.get('searchCollection')).filterBy('isNew', false);

        if (searchWords === []) {
          return collection;
        }

        return collection.filter((item) => {
          let itemName = item.get(this.get('searchAttribute')).toLowerCase();
          let i;

          for (i = 0; i < searchWords.length; i++) {
            let searchMatch = itemName.includes(searchWords[i]);

            if (searchMatch) {
              return true;
            }
          }
        });
      })
    );
  },

  actions: {
    performSearch(s) {
      this.set('searchQuery', s);
    }
  }
});
