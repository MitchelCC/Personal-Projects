import pandas as pd

print("Fanasty value will be decided by standard fantasy scoring metrics. Rebounds & Points = 1 fantasy pt, Assists = 1.5 pts, Steals & Blocks = 3 pts, & turnovers = -1 pts. ")
df = pd.read_csv(r"C:\Users\mitch\OneDrive\Documents\GitHub\Personal-Projects\NBA Fantasy\Player_Totals.csv", index_col = 0)
del df['birth_year']
#using stats from 2020 szn and later bc we know that basketball isn't a linear game and players can get better or worse with age
#we want the most recent data to get the most relevant results and predictions.
df = df[df['season'] >= 2020]
#we want the highest scoring players, but we know that scoring points isn't the only thing that matters in fantasy basketball
df = df[df['pts'] > 600] #there hundreds of players in the NBA, so we want only the most skilled. 700 pts should be a good baseline
df_basic = df.sort_values(by=['pts'], ascending=False)

#top 5 highest scoring players since 2020
#print(df_sorted.head())

#simplifying df to include basic stats only
columns_remove = ['birth_year', 'e_fg_percent', 'orb','drb','lg']
for col in columns_remove:
    if col in df_basic.columns:
        del df_basic[col]

#calc fantasy points
def calc_fantasy_points(row):
    fantasy_points = (
        row['pts'] * 1 + 
        row['trb'] * 1 +
        row['ast'] * 1.5 +
        row['stl'] * 3 +
        row['blk'] * 3 +
        row['tov'] * -1
    )
    return fantasy_points

df_basic['fantasy_points'] = df_basic.apply(calc_fantasy_points, axis=1)
df['fantasy_points'] = df.apply(calc_fantasy_points, axis=1)

print(df_basic.head(10))