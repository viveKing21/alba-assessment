"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type Sort = "featured" | "rating" | "title";

type Movie = {
  id: string;
  title: string;
  year: number;
  releaseDate: string;
  rating: number;
  genre: string;
  synopsis: string;
  poster: string;
  rank: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const earliestTimelineYear = 1900;
const timelineScrollStorageKey = "reeltime:timeline-scroll";

function getSort(value: string | null): Sort {
  return value === "rating" || value === "title" ? value : "featured";
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

function StarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function MovieSkeleton({ index }: { index: number }) {
  return <div className="movie-skeleton" style={{ "--card-index": index } as CSSProperties}><span /></div>;
}

export function Reeltime() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = getSort(searchParams.get("sort"));
  const currentYear = new Date().getUTCFullYear();
  const [years] = useState(() => Array.from({ length: currentYear - earliestTimelineYear + 1 }, (_, index) => currentYear - index));
  const [moviesByRequest, setMoviesByRequest] = useState<Record<string, Movie[]>>({});
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(new Set());
  const [failedRequests, setFailedRequests] = useState<Set<string>>(new Set());
  const [activeYear, setActiveYear] = useState(currentYear);
  const [visibleYears, setVisibleYears] = useState<Set<number>>(new Set([currentYear]));
  const [collectionYear, setCollectionYear] = useState<number | null>(null);
  const requestCache = useRef(new Set<string>());
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const sectionVisibility = useRef(new Map<number, number>());
  const yearNavRef = useRef<HTMLElement>(null);

  const fetchYearMovies = useCallback(async (year: number) => {
    const requestKey = `${sort}:${year}`;
    if (requestCache.current.has(requestKey)) return;

    requestCache.current.add(requestKey);
    setLoadingRequests((current) => new Set(current).add(requestKey));
    setFailedRequests((current) => {
      const next = new Set(current);
      next.delete(requestKey);
      return next;
    });

    try {
      const response = await fetch(`${apiUrl}/api/movies/${year}?sort=${sort}`);
      const payload = (await response.json()) as { data?: Movie[] };
      if (!response.ok || !payload.data) throw new Error("Unable to load this year.");
      setMoviesByRequest((current) => ({ ...current, [requestKey]: payload.data ?? [] }));
    } catch {
      requestCache.current.delete(requestKey);
      setFailedRequests((current) => new Set(current).add(requestKey));
    } finally {
      setLoadingRequests((current) => {
        const next = new Set(current);
        next.delete(requestKey);
        return next;
      });
    }
  }, [sort]);

  useLayoutEffect(() => {
    const savedScrollY = Number(window.sessionStorage.getItem(timelineScrollStorageKey));
    if (!Number.isFinite(savedScrollY) || savedScrollY <= 0) return;

    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, savedScrollY);
    document.documentElement.style.scrollBehavior = previousBehavior;
  }, []);

  useEffect(() => {
    const saveScrollPosition = () => {
      window.sessionStorage.setItem(timelineScrollStorageKey, String(window.scrollY));
    };

    window.addEventListener("pagehide", saveScrollPosition);
    return () => {
      saveScrollPosition();
      window.removeEventListener("pagehide", saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    sectionVisibility.current.clear();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const year = Number(entry.target.getAttribute("data-year"));
        if (!year) return;
        if (entry.isIntersecting) sectionVisibility.current.set(year, entry.intersectionRatio);
        else sectionVisibility.current.delete(year);
      });
      const [year] = [...sectionVisibility.current.entries()].sort(([, firstRatio], [, secondRatio]) => secondRatio - firstRatio)[0] ?? [];

      if (year) {
        setActiveYear(year);
        setVisibleYears((current) => current.has(year) ? current : new Set(current).add(year));
      }
    }, { rootMargin: "-18% 0px -52%", threshold: [0.12, 0.45, 0.8] });

    Object.values(sectionRefs.current).forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [years]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const year = Number(entry.target.getAttribute("data-year"));
        if (year) void fetchYearMovies(year);
      });
    }, { threshold: 0.01 });

    Object.values(sectionRefs.current).forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [fetchYearMovies, years]);

  useEffect(() => {
    const nav = yearNavRef.current;
    const activeButton = nav?.querySelector<HTMLButtonElement>(`button[data-year="${activeYear}"]`);
    if (!nav || !activeButton) return;
    const navCenter = nav.getBoundingClientRect().top + nav.clientHeight / 2;
    const buttonCenter = activeButton.getBoundingClientRect().top + activeButton.clientHeight / 2;
    nav.scrollBy({ top: buttonCenter - navCenter, behavior: "smooth" });
  }, [activeYear, years]);

  useEffect(() => {
    if (collectionYear === null) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCollectionYear(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [collectionYear]);

  function changeSort(nextSort: Sort) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  function scrollToYear(year: number) {
    sectionRefs.current[year]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const collectionRequestKey = collectionYear === null ? null : `${sort}:${collectionYear}`;
  const collectionMovies = collectionRequestKey ? moviesByRequest[collectionRequestKey] ?? [] : [];

  return (
    <main className="reeltime-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <aside className="timeline-rail" aria-label="Movie timeline navigation">
        <Link className="brand-lockup" href="/">
          <span className="brand-symbol"><i /><i /><i /></span>
          <span>Reel<span>time</span></span>
        </Link>
        <div className="rail-intro"><span>01</span><p>A living index<br />of cinema.</p></div>
        <nav className="year-nav" ref={yearNavRef}>
          <p>Timeline</p>
          {years.map((year) => <button data-year={year} key={year} className={year === activeYear ? "active" : ""} onClick={() => scrollToYear(year)} aria-current={year === activeYear ? "location" : undefined}><span>{year}</span><i /></button>)}
        </nav>
        <p className="rail-note">Powered by TMDB<br />Scroll to keep going</p>
      </aside>

      <section className="timeline-main">
        <header className="timeline-header">
          <div>
            <p className="eyebrow"><span />The annual cut</p>
            <h1>Some years<br /><em>never leave us.</em></h1>
          </div>
          <label className="sort-control">
            <span>Sequence</span>
            <select value={sort} onChange={(event) => changeSort(event.target.value as Sort)} aria-label="Sort movies">
              <option value="featured">Featured</option>
              <option value="rating">Highest rated</option>
              <option value="title">A to Z</option>
            </select>
          </label>
        </header>

        <div className="mobile-year-nav" aria-label="Movie timeline navigation">
          {years.map((year) => <button key={year} className={year === activeYear ? "active" : ""} onClick={() => scrollToYear(year)}>{year}</button>)}
        </div>

        <div className="year-stack">
          {years.map((year, yearIndex) => {
            const requestKey = `${sort}:${year}`;
            const movies = moviesByRequest[requestKey] ?? [];
            const isLoading = loadingRequests.has(requestKey);
            const hasFailed = failedRequests.has(requestKey);
            const isAwaiting = isLoading || (!hasFailed && !(requestKey in moviesByRequest));
            const displayedMovies = movies.slice(0, 4);

            return (
              <section
                className={`year-section${year === activeYear ? " is-active" : ""}${visibleYears.has(year) ? " is-visible" : ""}`}
                data-year={year}
                key={year}
                ref={(node) => { sectionRefs.current[year] = node; }}
              >
                <div className="year-marker"><span>Volume {String(yearIndex + 1).padStart(2, "0")}</span><strong>{year}</strong></div>
                <div className="year-panel">
                  <div className="year-panel-header">
                    <div><p>{year === currentYear ? "Now screening" : "In retrospect"}</p><h2>{year} <span>on film</span></h2></div>
                    <span className="film-count">{isAwaiting ? "Awaiting view" : `${movies.length} selected films`}</span>
                  </div>
                  <div className="movie-list">
                    {isAwaiting && Array.from({ length: 4 }, (_, index) => <MovieSkeleton index={index} key={index} />)}
                    {!isAwaiting && displayedMovies.map((movie, index) => (
                      <Link href={`/movie/${movie.id}?sort=${sort}&returnToTimeline=1`} className="film-card" key={movie.id} style={{ "--card-index": index } as CSSProperties}>
                        <div className="film-poster"><Image src={movie.poster} alt={`${movie.title} poster`} fill sizes="(max-width: 700px) 62vw, (max-width: 1120px) 25vw, 215px" /><div className="poster-shade" /><span className="film-position">{String(index + 1).padStart(2, "0")}</span><span className="open-film"><ArrowIcon /></span></div>
                        <div className="film-info"><div><p>{movie.genre}</p><h3>{movie.title}</h3></div><span className="rating"><StarIcon />{movie.rating.toFixed(1)}</span></div>
                      </Link>
                    ))}
                    {!isAwaiting && hasFailed && <div className="year-error"><p>The projector stalled.</p><button onClick={() => { void fetchYearMovies(year); }}>Try again <ArrowIcon /></button></div>}
                  </div>
                  {!isAwaiting && !hasFailed && movies.length > 4 && <button className="view-all" onClick={() => setCollectionYear(year)}><span>View all {movies.length} films</span><ArrowIcon /></button>}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      {collectionYear !== null && <div className="collection-modal-backdrop" onMouseDown={() => setCollectionYear(null)} role="presentation"><section className="collection-modal" role="dialog" aria-modal="true" aria-labelledby="collection-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="collection-modal-header"><div><p>Full collection</p><h2 id="collection-title">{collectionYear} <span>on film</span></h2></div><button className="modal-close" onClick={() => setCollectionYear(null)} aria-label="Close collection"><CloseIcon /></button></header>
        <div className="modal-movie-grid">{collectionMovies.map((movie, index) => <Link href={`/movie/${movie.id}?sort=${sort}&returnToTimeline=1`} className="film-card" key={movie.id} style={{ "--card-index": index } as CSSProperties}>
          <div className="film-poster"><Image src={movie.poster} alt={`${movie.title} poster`} fill sizes="(max-width: 700px) 42vw, 205px" /><div className="poster-shade" /><span className="film-position">{String(index + 1).padStart(2, "0")}</span><span className="open-film"><ArrowIcon /></span></div>
          <div className="film-info"><div><p>{movie.genre}</p><h3>{movie.title}</h3></div><span className="rating"><StarIcon />{movie.rating.toFixed(1)}</span></div>
        </Link>)}</div>
      </section></div>}
    </main>
  );
}
