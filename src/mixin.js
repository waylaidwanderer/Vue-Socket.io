export default {

    /**
     *  Assign runtime callbacks
     */
    beforeCreate(){

        if(!this.sockets) this.sockets = {};

        this.sockets.subscribe = (event, callback) => {
            if (this.$vueSocketIo.namespace) {
                this.$vueSocketIo[this.$vueSocketIo.namespace].emitter.addListener(event, callback, this);
            } else {
                this.$vueSocketIo.emitter.addListener(event, callback, this);
            }
        };

        this.sockets.unsubscribe = (event) => {
            if (this.$vueSocketIo.namespace) {
                this.$vueSocketIo[this.$vueSocketIo.namespace].emitter.removeListener(event, this);
            } else {
                this.$vueSocketIo.emitter.removeListener(event, this);
            }
        };

    },

    /**
     * Register all socket events
     */
    mounted(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                if(event !== 'subscribe' && event !== 'unsubscribe') {

                    if (this.$vueSocketIo.namespace) {
                        this.$vueSocketIo[this.$vueSocketIo.namespace].emitter.addListener(event, this.$options.sockets[event], this);
                    } else {
                        this.$vueSocketIo.emitter.addListener(event, this.$options.sockets[event], this);
                    }

                }

            });

        }

    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                if (this.$vueSocketIo.namespace) {
                    this.$vueSocketIo[this.$vueSocketIo.namespace].emitter.removeListener(event, this);
                } else {
                    this.$vueSocketIo.emitter.removeListener(event, this);
                }

            });

        }

    }

}