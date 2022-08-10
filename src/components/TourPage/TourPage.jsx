import React from "react";
import axios from "axios";
import { SiteHeader } from "../../components/SiteHeader/SiteHeader";
import SiteHtmlHelmetHead from "../SiteHtmlHelmetHead";
import HtmlClassManager from "../HtmlClassManager";
import Footer from "../Footer/Footer";
import StickyList from "../StickyList/StickyList";
import {
  META_TITLE,
  META_DESCRIPTION,
  DEFAULT_ROOM_ORDER,
} from "../../constants";
import { parseObject } from "../../objectDataUtils";
import { formatTourData } from "./tourPageHelper";
import NotFound from "../NotFound/notFound";

export default class TourPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: null,
      title: null,
      description: null,
      objects: null,
      roomOrder: null,
      heroImgSrc: null,
      metaImgUrl: null,
    };
  }

  async componentDidMount() {
    // Extract the slug for this tour
    const slug = this.props.location.pathname;

    // If we have a slug, retrieve information for the tour
    if (slug) {
      try {
        const tourResponse = await axios.get(`/api${slug}`);
        const { tourData, objects } = tourResponse.data;

        const roomOrder = tourData.roomOrder.length
          ? tourData.roomOrder.map(r => r.room.replaceAll("_", " "))
          : DEFAULT_ROOM_ORDER;

        const heroImageInvno = tourData.collectionObjects.find(obj => obj.heroImage).inventoryNumber;
        const object = objects.find((obj) => obj._source.invno.toLowerCase() === heroImageInvno.toLowerCase());
        const parsedObject = parseObject(object._source);
        const sections = formatTourData(roomOrder, objects, tourData.collectionObjects)

        this.setState({
          title: tourData.title,
          subtitle: tourData.subtitle,
          description: tourData.description.html,
          heroImageSrc: parsedObject.imageUrlLarge,
          metaImgUrl: parsedObject.imageUrlSmall,
          sections: sections,
        });
      } catch (error) {
        console.log(
          `An error occurred retrieving the tour for slug ${slug}`,
          error
        );
      } finally {
        this.setState({
          ...this.state,
          slug: slug,
        });
      }
    }
  }

  getMetaTags(title) {
    const metaTitle = `${META_TITLE} — ${title}`;
    const metaDescription = `Barnes Foundation Collection: ${title} -- ${META_DESCRIPTION}`;

    return {
      title: metaTitle,
      description: metaDescription,
      image: this.state.metaImgUrl,
    };
  }

  render() {
    const {
      slug,
      title,
      subtitle,
      description,
      heroImageSrc,
      sections,
    } = this.state;

    return (
        slug && title && sections ? (
          <div className="app app-tour-page">
            <SiteHtmlHelmetHead metaTags={this.getMetaTags(title)} />
            <HtmlClassManager />
            <SiteHeader isTour />
              {/* Display the tour if it was located */}
            <div>
              <StickyList
                title={title}
                subtitle={subtitle}
                heroImageSrc={heroImageSrc}
                description={description}
                sections={sections}
              />
            </div>
            <Footer />
          </div>
        ) : (
               // Otherwise, no tour found for that id
               <NotFound/>
             )
    );
  }
}
