export interface UserInterface {
    getWindowsEncryptionPassword(): Promise<string>;
    warnChromeOnLinuxWithoutCertutil(): Promise<void>;
    closeFirefoxBeforeContinuing(): Promise<void>;
    startFirefoxWizard(certificateHost: string): Promise<void>;
    firefoxWizardPromptPage(certificateURL: string): Promise<string>;
    waitForFirefoxWizard(): Promise<void>;
}
declare const DefaultUI: UserInterface;
export default DefaultUI;
//# sourceMappingURL=user-interface.d.ts.map