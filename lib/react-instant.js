'use babel';

import OutputView from './output-view';
import PlaygroundView from './playground-view.js';
import { CompositeDisposable } from 'atom';

export default {

  reactInstantView: null,
  modalPanel: null,
  subscriptions: null,
  playgroundEditor: null,

  activate(state) {
    this.reactInstantView = new OutputView(state.reactInstantViewState);
    this.playgroundView = new PlaygroundView(state.reactInstantViewState)
    this.playgroundEditor = atom.workspace.buildTextEditor()

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.reactInstantView.getElement(),
      visible: false
    });



    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'react-instant:toggle': () => this.toggle()
    }));
  },

  activeFileChanged(changes) {
      atom.workspace.getActiveTextEditor()



    console.log('file changed', atom.workspace.getActiveTextEditor().buffer.cachedText)

  },


  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.reactInstantView.destroy();
  },

  serialize() {
    return {
      reactInstantViewState: this.reactInstantView.serialize()
    };
  },

  canPreview() {
      return true
  },

  splitPane() {
        if (this.canPreview()) {
            const activePane = atom.workspace.getActivePane()
            // this.reactComponentPreviewView = this.getView()

            this.previewPanel = activePane.splitRight({
                items: [this.reactInstantView.getElement()]
            })

            this.previewPanel2 = activePane.splitRight({
                items: [this.playgroundEditor]
            })

            activePane.activate()
            // this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(this.activeFileChanged.bind(this)))
            atom.workspace.getActiveTextEditor().onDidStopChanging(this.activeFileChanged.bind(this))
            this.playgroundEditor.onDidStopChanging(this.playgroundCodeChanged.bind(this))
            // this.subscribeToFileEvents()
        }
    },

    playgroundCodeChanged(changes) {
        console.log('playground code changed', this.playgroundEditor.buffer.cachedText)
    },

  toggle() {
    console.log('ReactInstant was toggled!');
    this.splitPane()
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
