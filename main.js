const { Plugin } = require('obsidian')
const className = 'draft-indicator'

module.exports = class DraftIndicatorPlugin extends Plugin {
  async onload() {
    // update all files on startup or when enabling the plugin
    this.app.workspace.onLayoutReady(() => {
      this.app.vault.getMarkdownFiles().forEach((file) => this.update(file))
    })

    // update when any file metadata changes
    this.registerEvent(
      this.app.metadataCache.on('changed', (file) => this.update(file))
    )
  }

  async onunload() {
    // clean up the css classes
    this.app.vault.getMarkdownFiles().forEach((file) => {
      this.getElement(file).removeClass(className)
    })
  }

  update(file) {
    // get the file's frontmatter and add or remove the CSS class
    const metadata = this.app.metadataCache.getFileCache(file)
    const element = this.getElement(file)

    if (metadata.frontmatter?.draft === true) {
      element.addClass(className)
    } else {
      element.removeClass(className)
    }
  }

  getElement(file) {
    return this.app.workspace
      .getLeavesOfType('file-explorer')
      .find((leaf) => leaf.view.getViewType() === 'file-explorer').view
      .fileItems[file.path].el
  }
}
