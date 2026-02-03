# Cinewatch

In conjunction with [`cinewatch-api`]("https://github.com/lewishowles/cinewatch-api"), Cinewatch provides a quick and easy way to find the best way to watch multiple films in a single day at the cinema, minimising the time spent "waiting" between films.

Cinewatch will show the best options, including options where not all films can be seen, so that you can make an informed decision, and will then provide quick-links to book the appropriate films at the selected times.

## Limitations

Cinewatch currently only supports Cineworld. As Cinemas don't provide an accessible API, `cinewatch-api` retrieves data by scraping the appropriate details from the Cineworld website. As each cinema website is vastly different, and would need a custom implementation, and since my cinema of choice is Cineworld, this is the only chain for which a scraper has been written.

## Planning

The planning document for Cinewatch, outlining the requirements and decisions, can be found [in Notion]("https://lewishowles.notion.site/Cinewatch-2852b9e31211800b8e08f09f2202f8f9")
