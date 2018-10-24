import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup } from 'reactstrap';
import ReactAutolinker from 'react-autolinker';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './styles/index.scss';

class FashionCarousel extends React.Component {
    render() {
        return (
            <Carousel autoPlay={true} showArrows={true} showThumbs={false} showIndicators={false} showStatus={false}>
                <div>
                    <img src="pix/slide-1.jpg" alt="Slide 1" />
                    <p className="caption">Jean shorts craft beer viral</p>
                </div>
                <div>
                    <img src="pix/slide-2.jpg" alt="Slide 2" />
                    <p className="caption">Venmo ugh 90s freegan asymmetrical</p>
                </div>
                <div>
                    <img src="pix/slide-3.jpg" alt="Slide 3" />
                    <p className="caption">Typewriter fixie semiotics VHS</p>
                </div>
                <div>
                    <img src="pix/slide-4.jpg" alt="Slide 4" />
                    <p className="caption">Dolore chartreuse chambray retro adipisicing</p>
                </div>
                <div>
                    <img src="pix/slide-5.jpg" alt="Slide 5" />
                    <p className="caption">Hella art party aute minim incididunt cray</p>
                </div>
            </Carousel>
        );
    }
}

class FilterService extends React.Component {
    renderButton(i) {
        return (
            <Button
                id={i.toLowerCase()}
                value={i}
                onClick={() => this.props.onClick(i)}
                aria-label={i}
            >{i}</Button>

        );
    }

    render() {
        return (
            <ButtonGroup id="filters">
                {this.renderButton("All")}
                {this.renderButton("Manual")}
                {this.renderButton("Twitter")}
                {this.renderButton("Instagram")}
            </ButtonGroup>
        );
    }
}

class PostsList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            items: [],
            isLoading: false,
            error: null,
            filters: ['All', 'Manual', 'Twitter', 'Instagram'],
            service: 'All'
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        this.setState({ isLoading: true });
    }

    fetchData = () => {
        fetch('https://private-cc77e-aff.apiary-mock.com/posts')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Fetch request failed');
                }
            })
            .then(data => this.setState({items: (data.items).concat(this.state.items), isLoading: false}))
            .catch(error => this.setState({error, isLoading: false}));
    }
    handleClick(i) {
        this.setState({service: i});
    }

    render() {
        const {items, isLoading, error, filters, service} = this.state;

        if (error) {
            return <div className="alert alert-info fade show" role="alert">{error.message}</div>;
        }

        if (isLoading) {
            return <div className="alert alert-info fade show" role="alert">Loading Social Wall...</div>;
        }

        function TwitterPost(props) {
            return (
                <li className="post post--twitter">
                    <i className="post__icon fa fa-twitter"></i>
                    <div className="post__user">{props.userName}</div>
                    <div className="post__date">Posted {props.ago} days ago</div>
                    <div className="post__text">{props.text}</div>
                </li>
            );
        }

        function InstagramPost(props) {
            return (
                <li className="post post--instagram">
                    <i className="post__icon fa fa-instagram"></i>
                    <div className="post__image"><img src={props.imageUrl} alt="Instagram Post" className="img-fluid"/></div>
                    <div className="post__user">{props.userName}</div>
                    <div className="post__date">Posted {props.ago} days ago</div>
                    <div className="post__text">{props.text}</div>
                </li>
            );
        }

        function ManualPost(props) {
            return (
                <li className="post post--manual">
                    <span className="post__icon">AFF</span>
                    <div className="post__image"><img src={props.imageUrl} alt="AFF Post" className="img-fluid" /></div>
                    <div className="post__date">Posted {props.ago} days ago</div>
                    <div className="post__text">{props.text}</div>
                    <a target="_blank" rel="noopener noreferrer" className="post__link" href={props.linkUrl} >{props.linkText}</a>
                </li>
            );
        }

        const posts = [].concat(items);

        posts.sort(SortByDate);
        return (
            <div>
                <FilterService
                    filters={filters}
                    onClick={(i) => this.handleClick(i)}
                />

                <ul className='socialWall'>
                    {posts.map(post => {
                            let postServiceName = post.service_name.toLowerCase();
                            let postDateItemConv = new Date(post.item_published);
                            let ago = dateDiffInDays(postDateItemConv, today);
                            if (service === 'All') {
                                if ((postServiceName.toLowerCase() === 'twitter')) {
                                    return (
                                        <TwitterPost
                                            key={post.item_id}
                                            userName={post.item_data.user.username}
                                            ago={ago}
                                            text={<ReactAutolinker text={post.item_data.tweet} />}
                                        />

                                    );

                                } else if (postServiceName.toLowerCase() === 'instagram') {
                                    return (
                                        <InstagramPost
                                            key={post.item_id}
                                            userName={post.item_data.user.username}
                                            text={<ReactAutolinker text={post.item_data.caption} />}
                                            //imageUrl={post.item_data.image.medium}
                                            imageUrl={choosePic()}
                                            ago={ago}
                                        />
                                    );
                                } else {
                                    return (
                                        <ManualPost
                                            key={post.item_id}
                                            text={<ReactAutolinker text={post.item_data.text} />}
                                            //imageUrl={post.item_data.image_url}
                                            imageUrl={choosePic()}
                                            linkText={post.item_data.link_text}
                                            linkUrl={post.item_data.link}
                                            ago={ago}
                                        />
                                    );
                                }
                            } else if(service === 'Twitter') {
                                if ((postServiceName.toLowerCase() === 'twitter')) {
                                    return (
                                        <TwitterPost
                                            key={post.item_id}
                                            userName={post.item_data.user.username}
                                            text={<ReactAutolinker text={post.item_data.tweet} />}
                                            ago={ago}
                                        />
                                    );
                                }
                            } else if(service === 'Instagram'){
                                if ((postServiceName.toLowerCase() === 'instagram')) {
                                    return (
                                        <InstagramPost
                                            key={post.item_id}
                                            userName={post.item_data.user.username}
                                            text={<ReactAutolinker text={post.item_data.caption} />}
                                            //imageUrl={post.item_data.image.medium}
                                            imageUrl={choosePic()}
                                            ago={ago}
                                        />
                                    );
                                }
                            } else if(service === 'Manual'){
                                if ((postServiceName.toLowerCase() === 'manual')) {
                                    return (
                                        <ManualPost
                                            key={post.item_id}
                                            text={<ReactAutolinker text={post.item_data.text} />}
                                            //imageUrl={post.item_data.image_url}
                                            imageUrl={choosePic()}
                                            linkText={post.item_data.link_text}
                                            linkUrl={post.item_data.link}
                                            ago={ago}
                                        />
                                    );
                                }
                            }
                        })
                    }
                </ul>
                <button onClick={this.fetchData} type="button" id="more" className="btn btn-primary btn-lg">Show me more</button>
            </div>
        );
    }
}

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <p>
                    &copy; Copyright  by Christine Theodoridou
                </p>
            </footer>
        )
    }
}

class SocialWall extends React.Component {
    render() {
        return (
            <div>
                <FashionCarousel />
                <h1>Autumn Fashion Fix</h1>
                <PostsList />
                <Footer />
            </div>

        )
    }
}

// ========================================

ReactDOM.render(<SocialWall />,
    document.getElementById('root'));


//find the relative date
let today = new Date();
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

//random post picture
const postPic = [
    'pix/image-1.jpg',
    'pix/image-2.jpg',
    'pix/image-3.jpg',
    'pix/image-4.jpg',
    'pix/image-5.jpg',
    'pix/image-6.jpg',
    'pix/image-7.jpg',
    'pix/image-8.jpg',
    'pix/image-9.jpg',
    'pix/image-10.jpg',
    'pix/image-11.jpg'
];
function choosePic() {
    let randomNum = Math.floor(Math.random() * postPic.length);
    let randImage = postPic[randomNum];
    return randImage;
}

//sort posts by date
function SortByDate(x,y) {
    let sortColumnName = 'item_published';
    return ((x[sortColumnName]  === y[sortColumnName]) ? 0 : ((x[sortColumnName]> y[sortColumnName]) ? 1 : -1 ));
}
