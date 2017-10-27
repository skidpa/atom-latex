/** @babel */

import { CompositeDisposable, Disposable, Range } from 'atom'

export default class LinterDispatcher extends Disposable {
  disposables = new CompositeDisposable()

  constructor (register) {
    super(() => this.disposables.dispose())

    this.linter = register({
      name: 'LaTeX'
    })
    this.disposables.add(this.linter)

    this.disposables.add(latex.log.onMessages(({ messages, reset }) => this.onMessages(messages, reset)))
  }

  onMessages (messages, reset) {
    this.linter.setAllMessages(latex.log.getMessages(false).map(message => {
      const l = {
        severity: message.type,
        excerpt: message.text,
        location: {
          file: message.filePath || 'foo',
          position: message.range || [[0, 0], [0, 0]]
        }
      }

      if (message.logPath) {
        l.reference = {
          file: message.logPath,
          position: message.logRange || [[0, 0], [0, 0]]
        }
      }

      return l
    }))
  }
}
