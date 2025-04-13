import "obsidian";

declare module "obsidian" {
  class Plugin {
    app: App;
    manifest: any;
    addStatusBarItem(): HTMLElement;
    addCommand(command: Command): void;
    addSettingTab(tab: PluginSettingTab): void;
    loadData(): Promise<any>;
    saveData(data: any): Promise<void>;
    onload(): void;
    onunload(): void;
    registerView(type: string, viewCreator: (leaf: WorkspaceLeaf) => View): void;
  }

  class Modal {
    app: App;
    contentEl: HTMLElement;
    constructor(app: App);
    open(): void;
    close(): void;
    onOpen(): void;
    onClose(): void;
  }

  class Notice {
    constructor(message: string, timeout?: number);
    setMessage(message: string): this;
    hide(): void;
  }

  class Setting {
    constructor(containerEl: HTMLElement);
    setName(name: string): this;
    setDesc(desc: string): this;
    addToggle(callback: (toggle: any) => any): this;
    addText(callback: (text: any) => any): this;
    addDropdown(callback: (dropdown: any) => any): this;
    addButton(callback: (button: any) => any): this;
  }

  class PluginSettingTab {
    app: App;
    containerEl: HTMLElement;
    constructor(app: App, plugin: Plugin);
    display(): void;
    hide(): void;
  }

  interface App {
    workspace: Workspace;
    vault: Vault;
    plugins: {
      getPlugin(id: string): any;
    };
  }

  // Add moment.js type
  const moment: any;

  interface Workspace {
    activeLeaf: WorkspaceLeaf | null;
    getActiveFile(): TFile | null;
    getLeaf(newLeaf?: boolean | 'tab' | 'split'): WorkspaceLeaf;
    getLeavesOfType(viewType: string): WorkspaceLeaf[];
    revealLeaf(leaf: WorkspaceLeaf): void;
  }

  interface WorkspaceLeaf {
    view: View;
    setViewState(state: any): Promise<void>;
  }

  interface View {
    editor?: Editor;
    getViewType(): string;
    getDisplayText(): string;
    onOpen(): Promise<void>;
    onClose(): Promise<void>;
  }

  class ItemView implements View {
    contentEl: HTMLElement;
    leaf: WorkspaceLeaf;
    constructor(leaf: WorkspaceLeaf);
    getViewType(): string;
    getDisplayText(): string;
    onOpen(): Promise<void>;
    onClose(): Promise<void>;
    getIcon(): string;
  }

  interface Editor {
    getValue(): string;
  }

  interface Vault {
    read(file: TFile): Promise<string>;
    create(path: string, data: string): Promise<TFile>;
    createFolder(path: string): Promise<void>;
    getAbstractFileByPath(path: string): TAbstractFile | null;
    getMarkdownFiles(): TFile[];
    modify(file: TFile, data: string): Promise<void>;
  }

  interface TAbstractFile {
    path: string;
  }

  interface TFile extends TAbstractFile {
    basename: string;
    extension: string;
  }

  interface Command {
    id: string;
    name: string;
    callback: () => void;
  }

  interface HTMLElement {
    setText(text: string): void;
    onClickEvent(callback: (e: MouseEvent) => any): void;
    createEl<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: any): HTMLElementTagNameMap[K];
    createDiv(attrs?: any): HTMLDivElement;
    empty(): void;
    addClass(className: string): void;
    removeClass(className: string): void;
  }
}
