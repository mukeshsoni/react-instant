'use babel'
/* global atom */

import OutputView from './output-view'
// import PlaygroundView from './playground-view.js'
import { CompositeDisposable } from 'atom'
import { compiler as reactCompiler } from './compilers/react-compiler/index.js'
// console.log('react compiler', reactCompiler)
const compiler = reactCompiler()

export default {
  OutputView: null,
  reactInstantView: null,
  modalPanel: null,
  subscriptions: null,
  playgroundEditor: null,

  activate: function (state) {
    this.OutputView = new OutputView(state.reactInstantViewState)
    // this.playgroundView = new PlaygroundView(state.reactInstantViewState)
    this.playgroundEditor = atom.workspace.buildTextEditor()

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.OutputView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()
    compiler.outputStream.subscribe(this.handleOutput.bind(this))

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'react-instant:toggle': () => this.toggle()
    }))
  },

  handleOutput: function (output) {
    this.OutputView.onOutputChange(output)
  },

  activeFileChanged: function (changes) {
    // atom.workspace.getActiveTextEditor()
    // compiler.onCodeChange(atom.workspace.getActiveTextEditor().buffer.cachedText)
    // console.log('file changed', atom.workspace.getActiveTextEditor().buffer.cachedText)
  },

  deactivate: function () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.OutputView.destroy()
  },

  serialize: function () {
    return {
      reactInstantViewState: this.OutputView.serialize()
    }
  },

  canPreview: function () {
    return true
  },

  splitPane: function () {
    if (this.canPreview()) {
      const activePane = atom.workspace.getActivePane()
      // this.reactComponentPreviewView = this.getView()

      this.previewPanel = activePane.splitRight({
        items: [this.OutputView.getElement()]
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

  playgroundCodeChanged: function (changes) {
    console.log('playground code changed', this.playgroundEditor.buffer.cachedText)
  },

  toggle: function () {
    console.log('ReactInstant was toggled!')
    this.splitPane()
  // return (
  //   this.modalPanel.isVisible() ?
  //   this.modalPanel.hide() :
  //   this.modalPanel.show()
  // )
  }
}
