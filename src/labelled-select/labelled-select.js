const m = require('mithril');

function labelledSelect() {
  let label;
  let onselect;
  let options;

  function onchange(event) {
    onselect(event.target.value);
  }

  function mapOptions() {
    return options.map((option) => m('option', { value: option.value}, option.title));
  }

  return {
    oninit: (vnode) => {
      label = vnode.attrs.label;
      onselect = vnode.attrs.onselect;
    },
    view: (vnode) => {
      
      options = vnode.attrs.options;
      if (options && options.length > 0) { onselect(options[0].value); }

      return m('div.flex.pa1',
        [
          m('div.w-33.pr1', label),
          m('select.w-66', { onchange }, mapOptions()),
        ]
      );
    },
  };
} 

module.exports = labelledSelect;
