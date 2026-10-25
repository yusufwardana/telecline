import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(plug) TeleCline: Disconnected';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  const commands = [
    vscode.commands.registerCommand('telecline.setupTelegramBot', async () => {
      const token = await vscode.window.showInputBox({ prompt: 'Enter Telegram bot token', password: true });
      if (!token) {
        return;
      }
      await context.secrets.store('telecline.botToken', token);
      vscode.window.showInformationMessage('Telegram bot token saved.');
    }),
    vscode.commands.registerCommand('telecline.connect', async () => {
      statusBarItem.text = '$(sync~spin) TeleCline: Connecting';
      statusBarItem.tooltip = 'Connecting to Telegram';
      vscode.window.showInformationMessage('Connecting to Telegram...');
      setTimeout(() => {
        statusBarItem.text = '$(pass) TeleCline: Connected';
      }, 500);
    }),
    vscode.commands.registerCommand('telecline.disconnect', async () => {
      statusBarItem.text = '$(debug-disconnect) TeleCline: Disconnected';
      vscode.window.showInformationMessage('Disconnected from Telegram.');
    }),
    vscode.commands.registerCommand('telecline.sendTestMessage', async () => {
      const token = await context.secrets.get('telecline.botToken');
      if (!token) {
        vscode.window.showWarningMessage('Telegram bot token not configured.');
        return;
      }
      vscode.window.showInformationMessage(`Test message prepared for token: ${token.slice(0, 4)}...`);
    }),
    vscode.commands.registerCommand('telecline.selectWorkspace', async () => {
      const folders = vscode.workspace.workspaceFolders ?? [];
      if (folders.length === 0) {
        vscode.window.showWarningMessage('No workspaces available.');
        return;
      }
      const selected = await vscode.window.showQuickPick(folders.map((folder) => folder.name), { placeHolder: 'Select workspace' });
      if (selected) {
        vscode.window.showInformationMessage(`Workspace selected: ${selected}`);
      }
    }),
    vscode.commands.registerCommand('telecline.showStatus', async () => {
      vscode.window.showInformationMessage('TeleCline status: Disconnected');
    }),
    vscode.commands.registerCommand('telecline.openLogs', async () => {
      vscode.window.showInformationMessage('Open logs is not implemented in this minimal build.');
    }),
  ];

  context.subscriptions.push(...commands);
}

export function deactivate() {}
