export function UnsplashCredit({ photographerName, photographerUrl, imageUrl }) {
  return (
    <p className="flex flex-col sm:flex-row sm:gap-2 *:flex *:gap-2 absolute right-4 bottom-4 px-3 py-1 rounded-lg shadow-lg/50 overflow-hidden backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 font-bold">
      <span>
        Photo by
        <a className="link" href={photographerUrl}>
          {photographerName}
        </a>
      </span>
      <span>
        on
        <a className="link" href={imageUrl}>
          Unsplash
        </a>
      </span>
    </p>
  );
}
