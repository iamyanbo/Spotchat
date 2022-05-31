import React from "react";
import { Button } from "react-bootstrap";
import Home from "./Home";
import { NavbarComponent } from "./Navbar";

interface album{
    collaborative: boolean;
    description: string;
    external_urls: object;
    href: string;
    id: string;
    images: object[];
    name: string;
    owner: object;
    primary_color: null;
    public: boolean;
    snapshot_id: string;
    tracks: object;
    type: string;
    uri: string;
}

class Album extends React.Component<{}, any>{
    constructor(props: any){
        super(props);
        this.state = {
            user : JSON.parse(localStorage.getItem('user')!),
        }
    }
    render(){
        console.log(this.state.user)
        return(
            <div className="row">
                {this.state.user.albums.items.map((album: album) => {
                return (
                    <div className="card" style={{width: "15rem", margin:'0.3rem'}} key={album.id}>
                        <div className="card-header">
                        {album.public?"Public": "Private"}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{album.name}</h5>
                            <p className="card-text" dangerouslySetInnerHTML={{__html: album.description === ""?"No Description":album.description}}></p>
                        </div> 
                        <div className="card-footer text-muted mx-auto" style={{background:"transparent", borderTop: "0px"}}>
                            <Button variant="primary" href={album.uri} >View on Spotify</Button>
                        </div>
                    </div>
                );
                })}
            </div>
        );
    }
}
export default Album;
        