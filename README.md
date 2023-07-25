# nocsv

Treats JSON files of a particular format in a table like a csv.  
特定のフォーマットで書かれた JSON ファイルを
csv のように表形式で編集できる Editor です

## サンプル

画面表示

![image](https://github.com/Kotaro-Nakagawa/nocsv/assets/20413732/8c6cd075-87d2-44f7-9237-fe5c76de5f26)

<details>
<summary>対応する JSON </summary>
 
 ```json
 {
  "mainTable名": {
    "columns": [
      "hoge",
      "fuga",
      "piyo"
    ],
    "datas": [
      {
        "hoge": "record1 hoge",
        "fuga": "record1 fuga",
        "piyo": "record1 piyo"
      },
      {
        "subTable名": [
          {
            "hoge": "subtable1_record1 hoge",
            "fuga": "subtable1_record1 fuga",
            "piyo": "subtable1_record1 piyo"
          },
          {
            "hoge": "subtable1_record2 hoge",
            "fuga": "subtable1_record2 fuga",
            "piyo": "subtable1_record2 piyo"
          }
        ]
      },
      {
        "hoge": 123,
        "fuga": 456,
        "piyo": 789
      },
      {
        "subTable2名": [
          {
            "subTable2-1名": [
              {
                "hoge": "hogehogehoge",
                "fuga": "hogehogefuga",
                "piyo": "hogehogepiyo"
              },
              {
                "hoge": "fugahoge",
                "fuga": "fugafuga",
                "piyo": "fugapiyo"
              }
            ]
          },
          {
            "hoge": "subtable1_record1 hoge",
            "fuga": "subtable1_record1 fuga",
            "piyo": "subtable1_record1 piyo"
          },
          {
            "hoge": "subtable1_record2 hoge",
            "fuga": "subtable1_record2 fuga",
            "piyo": "subtable1_record2 piyo"
          }
        ]
      }
    ],
    "rules": []
  }
}
 ```

</details>

## 形式

 JSON のフォーマットは基礎部分、メインテーブル、列情報、サブテーブル、行情報、ルールからなります。
 具体的な構成は以下の通りです

### 基礎部分

```JSON
{
  "table名1" : {},
  "table名2" : {},
}
```

| キー | 値 |
| -- | -- |
| table名 | メインテーブル |

複数の table 情報を、テーブル名 : テーブル情報
の形で記載します。

### メインテーブル

```JSON
{
  "columns": [],
  "data": [],
  "rule": []
}
```

| キー | 値 |
| -- | -- |
| columns | 列データ、表の列になる |
| datas | メインデータ、表の値になる |
| rules | ルール、指定した列の値を他の列の値からの計算で入力できるようになる(予定) |

各テーブルの情報は大きく column, datas, rules で表現されます
表のデータとして表現されるのは主に datas に書かれている部分です。

### columns

データ本体のキー情報を記載します。
ここに記載されているキーが表のカラムになります。

### datas

データ本体です
各データは同じ key を持つオブジェクトの列として表現されます

例

```json
"datas": [
  {
    "hoge": "record1 hoge",
    "fuga": "record1 fuga",
    "piyo": "record1 piyo"
  },
  {
    "hoge": "record2 hoge",
    "fuga": "record2 fuga",
    "piyo": "record2 piyo"
  },
]
```

また、subtable でデータをまとめることもできます
subtable の JOSN形式は subtable の名前を key とする配列です。

例

```json
"datas": [
  {
    "hoge": "record1 hoge",
    "fuga": "record1 fuga",
    "piyo": "record1 piyo"
  },
  {
    "subTable名": [
      {
        "hoge": "subtable1_record1 hoge",
        "fuga": "subtable1_record1 fuga",
        "piyo": "subtable1_record1 piyo"
      },
      {
        "hoge": "subtable1_record2 hoge",
        "fuga": "subtable1_record2 fuga",
        "piyo": "subtable1_record2 piyo"
      }
    ]
  },
]
```

### rules

数式、入力規則、条件付き書式などを記載するエリアになる予定です
