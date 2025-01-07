class PeerServices {
    constructor(){
        if(!this.peer){
            this.peer = new RTCPeerConnection({
                iceServers:[{
                    urls:[
                        // these are open servers 
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ]
                }]
            })
        }
    }
     async getAnswer(offer){
       if(this.peer){
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));

        const ans = await this.peer.createAnswer();
        this.peer.setLocalDescription(new RTCSessionDescription(ans));
           return ans;
       }
     }
    async getOffer(){
        if(this.peer){
        const offer = await this.peer.createOffer();
        this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
        }
    }

    async setLocalDescription(ans) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
}

export default new PeerServices;