import React from 'react';
import { Button } from 'react-bootstrap';

class TopTracks extends React.Component<{}, any>{
    constructor(props: any){
        super(props);
        this.state = {
            user : JSON.parse(localStorage.getItem('user')!),
        }
    }
    render(){
        return (
            //make a card for each track with ranking
            <div className="row">
                {this.state.user.topTracks.items.map((track: any, i: number) => {
                    return (
                        <div className="card" style={{width: "15rem", margin:'0.3rem'}} key={track.id}>
                            <div className="card-header">
                                <h3>#{i+1}</h3>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{track.name}</h5>
                                <p className="card-text">{track.artists.map((artist: any) => {return artist.name}).join(", ")}</p>
                            </div> 
                            <div className="card-footer text-muted mx-auto" style={{background:"transparent", borderTop: "0px"}}>
                                <Button variant="primary" href={track.uri} >View on Spotify</Button>
                            </div>
                        </div>
                    );
                }
                )}
            </div>
        );
    }
}
export default TopTracks;