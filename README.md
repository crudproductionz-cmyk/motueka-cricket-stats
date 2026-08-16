# Motueka Cricket PWA Prototype

This is a mobile-first, responsive prototype using sample data.

## Test it locally

Because this is a PWA, run it through a local web server rather than opening `index.html` directly.

With Python installed:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## User flow

Home:
- Searchable player dropdown-style results
- Duplicate names are distinguished
- Selecting a player immediately opens the statistics screen

Statistics:
- Player is remembered
- Format / Grade / Team / Season are persistent
- Batting / Bowling / Fielding are tabs
- Vertical statistics follow the layout discussed
- Change Player returns to search

## Installability

The project includes a web app manifest and app icon. Once hosted over HTTPS, compatible browsers can offer "Install app" / "Add to Home screen".

## Deployment

This static prototype can be hosted on a free static host such as GitHub Pages. It does not require a server for the sample data.

Next step: connect the real Google Sheet/backend and implement exact statistics.
