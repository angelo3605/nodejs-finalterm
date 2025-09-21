import { ObjectId } from "mongodb";

export function createUrlFromSlugAndId(slug, id) {
    if (!slug || !id) return "";

    const stringId = id instanceof ObjectId ? id.toString().substring(0, 6) : id;

    return `/${slug}-${stringId}`;
}

export default createUrlFromSlugAndId;
