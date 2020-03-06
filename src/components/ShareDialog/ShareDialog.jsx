import React from 'react';
import './ShareDialog.css';
import { sharePlatforms, createShareForPlatform } from './shareModule';
import Icon from '../Icon';
import { ClickTracker } from '../SearchInput/Dropdowns/ClickTracker';

class Share extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showShareDialog: false,
			copyText: ''
		};

		this.copy = null;
	}

	componentDidMount() {
		const { setResetFunction } = this.props;
		setResetFunction(() => this.setState({ showShareDialog: false }));
	}

	toggleShareDialog = () => this.setState({ showShareDialog: !this.state.showShareDialog });

	onShareLinkClick = (platform) => {

		const { id, people, title } = this.props.object;
		const shareLink = createShareForPlatform(people, title, id, platform, this.props.object.imageUrlLarge);

		if (platform === sharePlatforms.COPY_URL) {
			this.copy.select();
			document.execCommand('copy');
		}
		else window.open(shareLink, '_blank');
	};

	/**
	 * Set ref and force update, as this will not set ref until after first render.
 	 * @param {HTMLElement} ref - element to set this.ref to.
	 */
	setRef = (ref) => {
		this.copy = ref;

		this.forceUpdate();
	}

	render() {
		const { showShareDialog } = this.state;
		const { id, people, title } = this.props.object;

		return (
			<div className='panel-button panel-button--share' onClick={() => { this.toggleShareDialog(); }}>
				{showShareDialog &&
					<div className="share-dialog">
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.FACEBOOK) }}>Facebook</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.TWITTER) }}>Twitter</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.PINTEREST) }}>Pinterest</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.EMAIL) }}>Email</a>
						<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.COPY_URL) }}>Copy Link</a>
						<input
							style={{ position: 'absolute', height: 0, opacity: '.01' }}
							ref={this.setRef}
							value={createShareForPlatform(people, title, id, sharePlatforms.COPY_URL, this.props.object.imageUrlLarge)}
						/>
					</div>
				}
				<div className='panel-button__content'>
					<div className='panel-button__icon' >
						<Icon svgId='-icon_share' classes='panel-button__svg' />
					</div>
					<span className='font-simple-heading panel-button__text'>Share It</span>
				</div>
			</div>
		)
	}
}

export const ShareDialog = (props) => {
	return (
		<ClickTracker>
			<Share {...props} />
		</ClickTracker>
	)
};
