const m = require('mithril')

function svg() {
  return {
    view: (vnode) => m('svg',
      {
        xlmns: 'http://www.w3.org/2000/svg',
        width: '30',
        height: '30',
        viewBox: '0 0 24 24',
        onclick: vnode.attrs.onclick,
      },
      vnode.children
    ),
  };
}

module.exports = svg;
