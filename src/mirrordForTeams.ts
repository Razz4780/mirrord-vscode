import * as vscode from 'vscode';
import { globalContext } from './extension';
import { NotificationBuilder } from './notification';
import { MirrordStatus } from './status';

const RUN_COUNTER = 'mirrord-for-teams-counter';
const NOTIFICATION_STARTS_AT = 100;
const NOTIFICATION_REPEATS_EVERY = 30;

async function showMirrordForTeamsNotification(message: string) {
    new NotificationBuilder()
        .withMessage(message)
        .withGenericAction("Try it now", async () => {
            await vscode.commands.executeCommand(MirrordStatus.mirrordForTeamsCommandId);
        })
        .withDisableAction("promptMirrordForTeams")
        .info();
}

export function tickMirrordForTeamsCounter(isDeploymentExec: boolean) {
    const counter = parseInt(globalContext.globalState.get(RUN_COUNTER) ?? '0') || 0;

    if (isDeploymentExec) {
        showMirrordForTeamsNotification(
            'When targeting multi-pod deployments, mirrord impersonates the first pod in the deployment.\n \
            Support for multi-pod impersonation requires the mirrord operator, which is part of mirrord for Teams.'
        );
    } else if (counter >= NOTIFICATION_STARTS_AT) {
        if (counter === NOTIFICATION_STARTS_AT || (counter - NOTIFICATION_STARTS_AT) % NOTIFICATION_REPEATS_EVERY === 0) {
            showMirrordForTeamsNotification(
                'For more features of mirrord, including multi-pod impersonation, check out mirrord for Teams.'
            );
        }
    }

    globalContext.globalState.update(RUN_COUNTER, `${counter + 1}`);
}
