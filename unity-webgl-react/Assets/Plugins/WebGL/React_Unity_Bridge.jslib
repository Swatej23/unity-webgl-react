mergeInto(LibraryManager.library, {
    CallReactMethodFromUnity : function (count){
        window.dispatchEvent(new CustomEvent("CallReactMethodFromUnity" , {
        detail: count}));
        console.log("React Event Fired with count:", count);
    },
    
    UpdateCountInReact : function UpdateCountInReact(count) {
        const event = new CustomEvent("UpdateCountInReact", { detail: count });
        window.dispatchEvent(event);
      }
});