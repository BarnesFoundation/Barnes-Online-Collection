import React from 'react';
import './ShareDialog.css';
import { sharePlatforms, createShareForPlatform } from './shareModule';
import Icon from '../Icon';
import { ClickTracker } from '../SearchInput/Dropdowns/ClickTracker';

export class ShareDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showShareDialog: false,
			copyText: ''
		};
	}

	toggleShareDialog = () => this.setState({ showShareDialog: !this.state.showShareDialog });

	onShareLinkClick = (platform) => {

		const { id, people, title } = this.props.object;
		const shareLink = createShareForPlatform(people, title, id, platform, this.props.object.imageUrlLarge);

		if (platform === sharePlatforms.COPY_URL) {
			this.setState({ copyText: shareLink },
				() => {
					this.copy.select();
					document.execCommand('copy');
				});
		}
		else window.open(shareLink, '_blank');
	};

	render() {
		const { copyText, showShareDialog } = this.state;

		const Share = () => {
			return (
				<div className="share">
					{showShareDialog &&
						<div className="share-dialog">
							<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.FACEBOOK) }}>Facebook</a>
							<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.TWITTER) }}>Twitter</a>
							<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.PINTEREST) }}>Pinterest</a>
							<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.EMAIL) }}>Email</a>
							<a className="share-dialog__link" onClick={() => { this.onShareLinkClick(sharePlatforms.COPY_URL) }}>Copy Link</a>
							<input style={{ position: 'absolute', height: 0, opacity: '.01' }} ref={(area) => this.copy = area} value={copyText} />
						</div>
					}
					<div className='panel-button panel-button--share' onClick={() => { this.toggleShareDialog(); }}>
						<div className='panel-button__content'>
							<div className='panel-button__icon' >
								<Icon svgId='-icon_share' classes='panel-button__svg' />
							</div>
							<span className='font-simple-heading panel-button__text'>Share It</span>
						</div>
					</div>
				</div>
			)
		}

		return (
			<ClickTracker resetFunction={() => { console.log('Hello'); }}>
				<Share />
			</ClickTracker>
		)
	}
}