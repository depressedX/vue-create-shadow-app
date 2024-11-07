declare module 'vue' {
    interface ComponentInternalInstance {
        isCE: boolean;
        shadowRoot: ShadowRoot;
        _childStylesAnchor?: Element;
        _styles?: HTMLStyleElement[];
        addCEChildStyle: (
            styles: string[] | undefined,
            instance: ComponentInternalInstance,
        ) => void;
        removeCEChildStyle: (styles: string[] | undefined, uid: string) => void;
    }
}

export {};
