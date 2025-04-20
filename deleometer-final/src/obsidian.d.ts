// Type declarations for Obsidian API
// This is a simplified version - you may need to add more types as needed

declare module "obsidian" {
    export class App {
        vault: Vault;
        workspace: Workspace;
    }

    export class Vault {
        adapter: DataAdapter;
        getRoot(): TFolder;
        read(file: TFile): Promise<string>;
        create(path: string, data: string): Promise<TFile>;
        delete(file: TAbstractFile, force?: boolean): Promise<void>;
        getResourcePath(file: TFile): string;
    }

    export class Workspace {
        activeLeaf: WorkspaceLeaf | null;
        getActiveFile(): TFile | null;
        getActiveViewOfType<T>(type: any): T | null;
        getLeavesOfType(type: string): WorkspaceLeaf[];
        getLeaf(newLeaf?: boolean): WorkspaceLeaf;
        revealLeaf(leaf: WorkspaceLeaf): void;
    }

    export class WorkspaceLeaf {
        view: View;
        setViewState(state: any): Promise<void>;
    }

    export class View {
        editor?: Editor;
    }

    export class Editor {
        getValue(): string;
        setValue(value: string): void;
    }

    export class DataAdapter {
        exists(path: string): Promise<boolean>;
        read(path: string): Promise<string>;
        write(path: string, data: string): Promise<void>;
    }

    export abstract class TAbstractFile {
        path: string;
        name: string;
        vault: Vault;
    }

    export class TFile extends TAbstractFile {
        extension: string;
        basename: string;
        stat: any;
    }

    export class TFolder extends TAbstractFile {
        children: TAbstractFile[];
    }

    export class Plugin {
        app: App;
        manifest: any;
        loadData(): Promise<any>;
        saveData(data: any): Promise<void>;
        addRibbonIcon(icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement;
        addStatusBarItem(): HTMLElement;
        addCommand(command: any): void;
        addSettingTab(settingTab: PluginSettingTab): void;
        registerView(type: string, viewCreator: (leaf: WorkspaceLeaf) => View): void;
    }

    export class PluginSettingTab {
        constructor(app: App, plugin: Plugin);
        display(): void;
        hide(): void;
    }

    export class Setting {
        constructor(containerEl: HTMLElement);
        setName(name: string): this;
        setDesc(desc: string): this;
        addText(callback: (text: TextComponent) => any): this;
        addToggle(callback: (toggle: ToggleComponent) => any): this;
        addButton(callback: (button: ButtonComponent) => any): this;
        addDropdown(callback: (dropdown: DropdownComponent) => any): this;
        addSlider(callback: (slider: SliderComponent) => any): this;
    }

    export class TextComponent {
        setValue(value: string): this;
        getValue(): string;
        setPlaceholder(placeholder: string): this;
        onChanged(callback: (value: string) => any): this;
    }

    export class ToggleComponent {
        setValue(value: boolean): this;
        getValue(): boolean;
        onChange(callback: (value: boolean) => any): this;
    }

    export class ButtonComponent {
        setButtonText(text: string): this;
        onClick(callback: () => any): this;
    }

    export class DropdownComponent {
        addOption(value: string, display: string): this;
        setValue(value: string): this;
        getValue(): string;
        onChange(callback: (value: string) => any): this;
    }

    export class SliderComponent {
        setValue(value: number): this;
        getValue(): number;
        setLimits(min: number, max: number, step: number): this;
        onChange(callback: (value: number) => any): this;
    }

    export class Notice {
        constructor(message: string, timeout?: number);
    }
}
