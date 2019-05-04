export default {

    /**
     *  Assign runtime callbacks
     */
    beforeCreate(){
        const objectsToCreate = [{
            name: 'sockets',
            namespace: null,
        }];

        if (this.$vueSocketIoNamespaces.length > 0) {
            this.$vueSocketIoNamespaces.forEach(namespace => objectsToCreate.push({
                name: `sockets_${namespace}`,
                namespace,
            }))
        }

        objectsToCreate.forEach(({ name, namespace }) => {
            if(!this[name]) this[name] = {};

            this[name].subscribe = (event, callback) => {
                if (namespace) {
                    this.$vueSocketIo[namespace].emitter.addListener(event, callback, this);
                } else {
                    this.$vueSocketIo.emitter.addListener(event, callback, this);
                }
            };

            this[name].unsubscribe = (event) => {
                if (namespace) {
                    this.$vueSocketIo[namespace].emitter.removeListener(event, this);
                } else {
                    this.$vueSocketIo.emitter.removeListener(event, this);
                }
            };
        });
    },

    /**
     * Register all socket events
     */
    mounted(){
        const socketObjects = [{
            name: 'sockets',
            namespace: null,
        }];

        if (this.$vueSocketIoNamespaces.length > 0) {
            this.$vueSocketIoNamespaces.forEach(namespace => socketObjects.push({
                name: `sockets_${namespace}`,
                namespace,
            }))
        }

        socketObjects.forEach(({ object, namespace }) => {
            if (!this.$options[object]) {
                return;
            }
            Object.keys(this.$options[object]).forEach(event => {
                if (event === 'subscribe' || event === 'unsubscribe') {
                    return;
                }
                if (namespace) {
                    this.$vueSocketIo[namespace].emitter.addListener(event, this.$options[object][event], this);
                } else {
                    this.$vueSocketIo.emitter.addListener(event, this.$options[object][event], this);
                }
            });
        });
    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy(){
        const socketObjects = [{
            name: 'sockets',
            namespace: null,
        }];

        if (this.$vueSocketIoNamespaces.length > 0) {
            this.$vueSocketIoNamespaces.forEach(namespace => socketObjects.push({
                name: `sockets_${namespace}`,
                namespace,
            }))
        }

        socketObjects.forEach(({ object, namespace }) => {
            if (!this.$options[object]) {
                return;
            }
            Object.keys(this.$options[object]).forEach(event => {
                if (namespace) {
                    this.$vueSocketIo[namespace].emitter.removeListener(event, this);
                } else {
                    this.$vueSocketIo.emitter.removeListener(event, this);
                }
            });
        });
    }
}