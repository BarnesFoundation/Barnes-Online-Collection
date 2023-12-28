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
import { parseObject } from "../../shared/utils";
import {
  formatTourData,
  languageToLocale,
  localeToLanguage,
} from "./tourPageHelper";
import NotFound from "../NotFound/notFound";
import Spinner from "../Spinner/Spinner";

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
      loading: true,
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
        const languages = tourData.localizations.map((data) =>
          localeToLanguage(data.locale)
        );

        const roomOrder = tourData.roomOrder.length
          ? tourData.roomOrder.map((r) => r.room.replaceAll("_", " "))
          : DEFAULT_ROOM_ORDER;

        const heroImageInvno = tourData.collectionObjects.find(
          (obj) => obj.heroImage
        ).inventoryNumber;
        const object = objects.find(
          (obj) =>
            obj._source.invno.toLowerCase() === heroImageInvno.toLowerCase()
        );
        const parsedObject = parseObject(object._source);
        const sections = formatTourData(
          roomOrder,
          objects,
          tourData.collectionObjects
        );

        this.setState({
          title: tourData.title,
          subtitle: tourData.subtitle,
          description: tourData.description.html,
          heroImageSrc: parsedObject.imageUrlLarge,
          metaImgUrl: parsedObject.imageUrlSmall,
          sections: sections,
          selectedLanguage: "English",
          languages: languages.length ? ["English", ...languages] : null,
          tourData,
          objects,
          roomOrder,
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
          loading: false,
        });
      }
    }
  }

  // Handles updating the copy based on the selected language
  handleSelectLanguage(language) {
    const { tourData, roomOrder, objects } = this.state;
    const requestedLocale = languageToLocale(language);

    if (requestedLocale === "en") {
      const sections = formatTourData(
        roomOrder,
        objects,
        tourData.collectionObjects
      );

      this.setState({
        ...this.state,
        title: tourData.title,
        subtitle: tourData.subtitle,
        description: tourData.description,
        sections: sections,
        selectedLanguage: language,
      });
    } else {
      // get collection objects from localization
      const localization = tourData.localizations.find(
        (data) => data.locale === requestedLocale
      );
      const collectionObjects = localization.collectionObjects.map(
        (collectionObj) => {
          const locale = collectionObj.localizations.find(
            (data) => data.locale === requestedLocale
          );
          return { ...collectionObj, ...locale };
        }
      );
      const sections = formatTourData(roomOrder, objects, collectionObjects);

      this.setState({
        ...this.state,
        title: localization.title || tourData.title,
        subtitle: localization.subtitle || tourData.subtitle,
        description:
          (localization.description && localization.description.html) ||
          tourData.description.html,
        sections,
        selectedLanguage: language,
      });
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
    const { slug, title, sections, loading } = this.state;

    if (loading) {
      return (
        <div className="app app-tour-page">
          <SiteHtmlHelmetHead metaTags={this.getMetaTags(title)} />
          <HtmlClassManager />
          <SiteHeader isTour />
          {/* Display the tour if it was located */}
          <div>
            <Spinner />
          </div>
          <Footer />
        </div>
      );
    }

    return slug && title && sections ? (
      <div className="app app-tour-page">
        <SiteHtmlHelmetHead metaTags={this.getMetaTags(title)} />
        <HtmlClassManager />
        <SiteHeader isTour />
        {/* Display the tour if it was located */}
        <div>
          <StickyList
            {...this.state}
            handleSelectLanguage={this.handleSelectLanguage.bind(this)}
          />
        </div>
        <Footer />
      </div>
    ) : (
      // Otherwise, no tour found for that id
      <NotFound />
    );
  }
}
