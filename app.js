import streamlit as st
import pandas as pd
from pathlib import Path

st.set_page_config(
    page_title="Motueka Cricket Statistics",
    page_icon="🏏",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# -----------------------------
# Styling
# -----------------------------
st.markdown("""
<style>
.stApp { background: #eef4f5; }

.hero {
    min-height: 360px;
    padding: 32px;
    border-radius: 18px;
    background:
      linear-gradient(rgba(15,18,18,.40), rgba(15,18,18,.48)),
      url("https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1600&q=80");
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    color: white;
    margin-bottom: 24px;
}
.hero h1 { font-size: 2.5rem; margin: 0; }
.hero p { font-size: 1.05rem; margin: 5px 0 0; }

div[data-testid="stMetric"] {
    background: #f4bd22;
    border-radius: 12px;
    padding: 12px;
}

.stat-card {
    background: #f4bd22;
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    min-height: 90px;
    margin-bottom: 12px;
}
.stat-label { font-weight: 700; font-size: .9rem; }
.stat-value { font-size: 1.65rem; font-weight: 800; margin-top: 5px; }

.player-banner {
    background: #f4bd22;
    border-radius: 14px;
    padding: 14px 20px;
    margin-bottom: 15px;
}
.player-banner .name { font-size: 1.5rem; font-weight: 800; }
.player-banner .sub { font-size: .9rem; }

div[data-baseweb="select"] > div {
    border-radius: 10px;
}

.stButton > button {
    border-radius: 10px;
    font-weight: 700;
}
</style>
""", unsafe_allow_html=True)

# -----------------------------
# Data
# -----------------------------
@st.cache_data
def load_data():
    return pd.read_csv(Path("data/stats.csv"))

df = load_data()

# -----------------------------
# Session state
# -----------------------------
if "page" not in st.session_state:
    st.session_state.page = "Home"
if "player_id" not in st.session_state:
    st.session_state.player_id = None

for key in ["format", "grade", "team", "season"]:
    if key not in st.session_state:
        st.session_state[key] = "All"

# -----------------------------
# Helpers
# -----------------------------
def options(column):
    vals = sorted(df[column].dropna().astype(str).unique()) if column in df else []
    return ["All"] + vals

def filtered_player_data():
    out = df[df["Player ID"] == st.session_state.player_id].copy()
    for state_key, column in [
        ("format", "Format"),
        ("grade", "Grade"),
        ("team", "Team"),
        ("season", "Season"),
    ]:
        value = st.session_state[state_key]
        if value != "All":
            out = out[out[column].astype(str) == value]
    return out

def total(data, col):
    return data[col].sum() if col in data.columns else 0

def safe_div(a, b, digits=2):
    return round(a / b, digits) if b else 0

def show_cards(stats, per_row=3):
    for start in range(0, len(stats), per_row):
        cols = st.columns(per_row)
        for col, (label, value) in zip(cols, stats[start:start + per_row]):
            with col:
                st.markdown(
                    f'<div class="stat-card">'
                    f'<div class="stat-label">{label}</div>'
                    f'<div class="stat-value">{value}</div>'
                    f'</div>',
                    unsafe_allow_html=True
                )

# -----------------------------
# Navigation
# -----------------------------
if st.session_state.page != "Home":
    left, right = st.columns([1, 5])
    with left:
        if st.button("← Home", use_container_width=True):
            st.session_state.page = "Home"
            st.rerun()

# -----------------------------
# PAGE 1 — HOME
# -----------------------------
if st.session_state.page == "Home":
    st.markdown("""
    <div class="hero">
        <h1>Motueka Cricket Club</h1>
        <p>Player Statistics • Est. 1857</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("### Find a player")

    # Display name is deliberately NOT just first + last name.
    # This allows duplicate names to be distinguished.
    player_choices = [""] + sorted(
        df["Player ID"].unique(),
        key=lambda pid: df.loc[df["Player ID"] == pid, "Display Name"].iloc[0]
    )

    display_map = {
        pid: df.loc[df["Player ID"] == pid, "Display Name"].iloc[0]
        for pid in df["Player ID"].unique()
    }

    selected_id = st.selectbox(
        "Player name",
        player_choices,
        index=player_choices.index(st.session_state.player_id)
        if st.session_state.player_id in player_choices else 0,
        format_func=lambda pid: "" if pid == "" else display_map[pid],
        placeholder="Start typing a player name...",
        label_visibility="collapsed",
    )

    # Selecting a player immediately opens Page 2.
    if selected_id:
        st.session_state.player_id = selected_id
        st.session_state.page = "Statistics"
        st.rerun()

    st.caption("Start typing a name, then click the required player. Duplicate names are distinguished by team/grade.")

# -----------------------------
# PAGE 2 — PROFILE + TABS
# -----------------------------
else:
    pid = st.session_state.player_id
    player = df[df["Player ID"] == pid]

    if player.empty:
        st.session_state.page = "Home"
        st.rerun()

    display_name = player["Display Name"].iloc[0]
    st.markdown(
        f'<div class="player-banner">'
        f'<div class="name">{display_name}</div>'
        f'<div class="sub">Player Profile & Statistics</div>'
        f'</div>',
        unsafe_allow_html=True
    )

    # Persistent filters. They stay in session state when switching tabs.
    st.markdown("#### Filters")
    f1, f2, f3, f4 = st.columns(4)

    with f1:
        opts = options("Format")
        st.session_state.format = st.selectbox(
            "Format", opts,
            index=opts.index(st.session_state.format)
            if st.session_state.format in opts else 0,
            key="format_widget"
        )
    with f2:
        opts = options("Grade")
        st.session_state.grade = st.selectbox(
            "Grade", opts,
            index=opts.index(st.session_state.grade)
            if st.session_state.grade in opts else 0,
            key="grade_widget"
        )
    with f3:
        opts = options("Team")
        st.session_state.team = st.selectbox(
            "Team", opts,
            index=opts.index(st.session_state.team)
            if st.session_state.team in opts else 0,
            key="team_widget"
        )
    with f4:
        opts = options("Season")
        st.session_state.season = st.selectbox(
            "Season", opts,
            index=opts.index(st.session_state.season)
            if st.session_state.season in opts else 0,
            key="season_widget"
        )

    data = filtered_player_data()

    st.markdown("---")

    # These are tabs, not separate pages.
    batting_tab, bowling_tab, fielding_tab = st.tabs(
        ["🏏 Batting", "🎯 Bowling", "🧤 Fielding"]
    )

    with batting_tab:
        innings = total(data, "Innings")
        runs = total(data, "Runs")
        not_outs = total(data, "Not Outs")
        balls = total(data, "Balls Faced")

        batting_stats = [
            ("Matches", f"{total(data, 'Matches'):,.0f}"),
            ("Innings", f"{innings:,.0f}"),
            ("NO", f"{not_outs:,.0f}"),
            ("HS", f"{data['HS'].max():,.0f}" if "HS" in data and len(data) else "—"),
            ("Runs", f"{runs:,.0f}"),
            ("Ave", f"{safe_div(runs, innings - not_outs):.2f}"),
            ("S/R", f"{safe_div(runs * 100, balls):.2f}"),
            ("100", f"{total(data, '100s'):,.0f}"),
            ("50", f"{total(data, '50s'):,.0f}"),
            ("4s", f"{total(data, '4s'):,.0f}"),
            ("6s", f"{total(data, '6s'):,.0f}"),
        ]
        show_cards(batting_stats)

    with bowling_tab:
        balls = total(data, "Bowling Balls")
        wickets = total(data, "Wickets")
        runs = total(data, "Bowling Runs")

        # Cricket overs are displayed as balls/6 plus remaining balls.
        overs = f"{balls // 6}.{balls % 6}"

        bowling_stats = [
            ("Bowling Innings", f"{total(data, 'Bowling Innings'):,.0f}"),
            ("Overs", overs),
            ("Maidens", f"{total(data, 'Maidens'):,.0f}"),
            ("Runs", f"{runs:,.0f}"),
            ("Wickets", f"{wickets:,.0f}"),
            ("Ave", f"{safe_div(runs, wickets):.2f}"),
            ("S/R", f"{safe_div(balls, wickets):.2f}"),
            ("BBI", str(data["BBI"].iloc[0]) if "BBI" in data and len(data) else "—"),
            ("BBM", str(data["BBM"].iloc[0]) if "BBM" in data and len(data) else "—"),
            ("5WI", f"{total(data, '5WI'):,.0f}"),
            ("10WM", f"{total(data, '10WM'):,.0f}"),
            ("RPO", f"{safe_div(runs * 6, balls):.2f}"),
        ]
        show_cards(bowling_stats)

    with fielding_tab:
        fielding_stats = [
            ("Outfield Catches", f"{total(data, 'Catches'):,.0f}"),
            ("Wicket Keeper Catches", f"{total(data, 'WK Catches'):,.0f}"),
            ("Stumpings", f"{total(data, 'Stumpings'):,.0f}"),
        ]
        show_cards(fielding_stats)

    with st.expander("Show underlying sample data"):
        st.dataframe(data, use_container_width=True, hide_index=True)

    if st.button("Change player"):
        st.session_state.page = "Home"
        st.rerun()

st.caption("Sample-data prototype — ready to connect to the real cricket spreadsheet.")
