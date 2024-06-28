import country_converter as coco
import pandas
from pandas import DataFrame


def convert_nat3(df: DataFrame, nat_col_prefix: str):
    nat3_col = f"{nat_col_prefix}3"
    nat2_col = f"{nat_col_prefix}2"
    nat_full_col = f"{nat_col_prefix}Full"

    cc = coco.CountryConverter()
    iso3_nat3s = ["GRL", "MAC"]
    ioc_nat3 = df[~df[nat3_col].isin(iso3_nat3s)][nat3_col].dropna()
    iso3_nat3 = df[df[nat3_col].isin(iso3_nat3s)][nat3_col].dropna()
    nat2_1 = cc.pandas_convert(series=ioc_nat3, to="ISO2", src="IOC")
    nat2_2 = cc.pandas_convert(series=iso3_nat3, to="ISO2", src="ISO3")
    df[nat2_col] = pandas.concat([nat2_1, nat2_2])
    df[nat_full_col] = cc.pandas_convert(
        series=df[nat2_col].dropna(), to="name_short", src="ISO2"
    )

    return df
