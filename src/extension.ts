import * as vscode from 'vscode';
import { ConfigurationProvider } from './debugger';
import { MirrordStatus } from './status';
import { getMirrordBinary } from './binaryManager';

export let globalContext: vscode.ExtensionContext;

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	globalContext = context;

	const enabled = vscode.workspace.getConfiguration().get<boolean | null>("mirrord.enabledByDefault");
	context.workspaceState.update('enabled', enabled);
	vscode.debug.registerDebugConfigurationProvider('*', new ConfigurationProvider(), 2);

	// start mirrord binary updates, so that we avoid downloading mid session
	await getMirrordBinary(true);

	new MirrordStatus(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0))
		.register()
		.draw();
}
