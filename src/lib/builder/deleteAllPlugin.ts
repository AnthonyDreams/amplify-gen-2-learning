import { Editor } from 'grapesjs'

export default (editor: Editor) => {
  editor.Commands.add('delete-code', {
    run: (editord) => {
      editord.DomComponents.clear()
    },
  })
  editor.Panels.addButton('options', [
    {
      id: 'delete',
      className: 'fa fa-eraser gjs-pn-btn',
      command: 'delete-code',
      attributes: {
        title: 'Delete design',
      },
    },
  ])
}
