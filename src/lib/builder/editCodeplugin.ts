import { Editor } from 'grapesjs'

export default (editor: Editor) => {
  const pfx = editor.getConfig().stylePrefix
  const modal = editor.Modal
  const cmdm = editor.Commands
  const htmlCodeViewer = editor.CodeManager.getViewer('CodeMirror').clone()
  const cssCodeViewer = editor.CodeManager.getViewer('CodeMirror').clone()
  const pnm = editor.Panels
  const container = document.createElement('div')
  const btnEdit = document.createElement('button')

  htmlCodeViewer.set({
    codeName: 'htmlmixed',
    readOnly: 0,
    theme: 'hopscotch',
    autoBeautify: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    styleActiveLine: true,
    smartIndent: true,
    indentWithTabs: true,
  })

  cssCodeViewer.set({
    codeName: 'css',
    readOnly: 0,
    theme: 'hopscotch',
    autoBeautify: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    styleActiveLine: true,
    smartIndent: true,
    indentWithTabs: true,
  })

  btnEdit.innerHTML = 'Save'
  btnEdit.className = `${pfx}btn-prim ${pfx}btn-import`
  btnEdit.onclick = () => {
    const html = htmlCodeViewer.editor.getValue()
    const css = cssCodeViewer.editor.getValue()
    editor.setComponents(html.trim())
    editor.setStyle(css)
    modal.close()
  }

  cmdm.add('edit-code', {
    run: (editord, sender) => {
      sender?.set('active', 0)
      let htmlViewer = htmlCodeViewer.editor
      let cssViewer = cssCodeViewer.editor
      modal.setTitle('Edit code')
      if (!htmlViewer && !cssViewer) {
        const txtarea = document.createElement('textarea')
        const cssarea = document.createElement('textarea')
        container.appendChild(txtarea)
        container.appendChild(cssarea)
        container.appendChild(btnEdit)
        htmlCodeViewer.init(txtarea)
        cssCodeViewer.init(cssarea)
        htmlViewer = htmlCodeViewer.editor
        cssViewer = cssCodeViewer.editor
      }
      const InnerHtml = editord.getWrapper()?.toHTML({ withProps: true })
      const Css = editord.getCss()
      modal.setContent('')
      modal.setContent(container)
      htmlCodeViewer.setContent(InnerHtml)
      cssCodeViewer.setContent(Css)
      modal.open()
      htmlViewer.refresh()
      cssViewer.refresh()
    },
  })

  pnm.addButton('options', [
    {
      id: 'edit',
      className: 'fa fa-file-code-o gjs-pn-btn',
      command: 'edit-code',
      attributes: {
        title: 'Edit Code',
      },
    },
  ])
}
