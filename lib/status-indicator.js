/** @babel */

import StatusLabel from './views/status-label'
import { Disposable } from 'atom'

export default class StatusIndicator extends Disposable {
  busyMessage = new Disposable(() => {})

  constructor () {
    super(() => {
      this.busyMessage.dispose()
      this.detachStatusBar()
    })
  }

  attachStatusBar (statusBar) {
    this.statusLabel = new StatusLabel()
    this.statusTile = statusBar.addLeftTile({
      item: this.statusLabel,
      priority: 9001
    })
  }

  detachStatusBar () {
    if (this.statusTile) {
      this.statusTile.destroy()
      this.statusTile = null
    }
    if (this.statusLabel) {
      this.statusLabel.destroy()
      this.statusLabel = null
    }
  }

  attachBusySignal (service) {
    this.busySignalService = service
  }

  detachBusySignal () {
    this.busySignalService = null
  }

  setBusy (text = 'LaTeX: Processing') {
    if (this.statusLabel) {
      this.statusLabel.update({ busy: true })
    }

    if (this.busySignalService) {
      this.busyMessage.dispose()
      this.busyMessage = this.busySignalService.reportBusy(text)
    }
  }

  setIdle () {
    if (this.statusLabel) {
      this.statusLabel.update({ busy: false })
    }

    this.busyMessage.dispose()
  }

  show (text, type, icon, spin, title, onClick) {
    if (this.statusLabel) {
      this.statusLabel.update({ text, type, icon, spin, title, onClick })
    }
  }
}
