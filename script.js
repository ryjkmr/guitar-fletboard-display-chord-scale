$(function () {

  //コードとスケールの音程を格納
  const CHORD_DATA = {
    M: ["root", "third", "fifth"],
    M7: ["root", "third", "fifth", "maj7"],
    _7: ["root", "third", "fifth", "flat7"],//数字は要素名の先頭にできないので_7としている
    m: ["root", "flat3", "fifth"],
    m7: ["root", "flat3", "fifth", "flat7"],
    m7b5: ["root", "flat3", "flat5", "flat7"],
    dim: ["root", "flat3", "flat5", "sixth"],
    maj_scale: ["root", "nineth", "third", "fourth", "fifth", "sixth", "maj7"],
    min_penta: ["root", "flat3", "fourth", "fifth", "flat7"],
    maj_penta: ["root", "nineth", "third", "fifth", "sixth"],
    root: ["root"],
  };

  //表示用の文字を格納
  const CHORD_CHARACTOR = {
    M: ["●", "③", "⑤"],
    M7: ["●", "③", "⑤", "7"],
    _7: ["●", "③", "⑤", "♭7"],//数字は要素名の先頭にできないので_7としている
    m: ["●", "♭3", "⑤"],
    m7: ["●", "♭3", "⑤", "♭7"],
    m7b5: ["●", "♭3", "♭5", "♭7"],
    dim: ["●", "♭3", "♭5", "6"],
    maj_scale: ["●", "②", "③", "④", "⑤", "⑥", "⑦"],
    min_penta: ["●", "♭3", "④", "⑤", "♭7"],
    maj_penta: ["●", "②", "③", "⑤", "⑥"],
    root: ["●"],
  };

  //ルートを数値に変換する辞書
  const key_to_num = { A: 0, As: 1, Bb: 1, B: 2, C: 3, Cs: 4, Db: 4, D: 5, Ds: 6, Eb: 6, E: 7, F: 8, Fs: 9, Gb: 9, G: 10, Gs: 11, Ab: 11 }

  //音名から相対音程を表す数値（半音＝1）への変換辞書
  const interval_to_num = {
    root: 0, flat2: 1, flat9: 1, second: 2, nineth: 2, flat3: 3, sharp9: 3, third: 4, eleventh: 5, fourth: 5,
    sharp11: 6, flat5: 6, fifth: 7, sharp5: 8, flat13: 8, flat6: 8, thirteenth: 9, sixth: 9, sharp13: 10, sharp6: 10, flat7: 10, maj7: 11
  };

  //#表記と♭表記の使い分け用の辞書。G#をGsと書くのはクラス名に#が使えないため。フラットは小文字のBで代用しているので問題ない
  const key_sharp = ["A", "As", "B", "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs"];
  const key_flat = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];

  /*
    コードやスケールを表示するまでの変換過程
    key → key_to_numでキー（ルート音）を数値に変換
    CHORD_DATA　→　inter_val_to_num で相対音程の数値に変換 → キーの数値と足し算して絶対音程の数値に変換
      → key_sharp か key_flatを使って、絶対音名に変換
      → 絶対音名でクラス指定したテーブルセルにCHORD_CHARACTORから取得した表記を記入する
  */

  let key = "A";//初期値。ルート音
  let chord_type = "_7";//初期値。
  let disp_type = "dosuu";//初期値　度数表記か絶対値表記かを指定
  let chord_Name = "7";//初期値。表示名

  generateTab($('#key-input').val().replace("#", "s"), chord_type, disp_type);

  function generateTab(key, chord_type, disp_type) {

    if (!key) return;
    //clear all tab
    $(".flet-cell").text("");

    const key_num = key_to_num[key];//ルート音を数値に変換。A=0
    console.log("key_num", key_num);
    const chord_tone = [];
    for (let tone of CHORD_DATA[chord_type]) { //コードデータから、root,thirdといった相対音程の情報を取り出して

      let temp = interval_to_num[tone] + key_num;//数値に変換。key_numを足して絶対音に変換
      if (temp > 11) temp -= 12;//音階は0〜11までなのでオーバーフロー処理
      console.log(tone, temp);
      if (key.slice(1.2) === "b" || key === "F") { //♭キーとFの時は♭表記にする
        chord_tone.push(key_flat[temp]);//コードトーンを格納
      } else {
        chord_tone.push(key_sharp[temp]);//コードトーンを格納（絶対音名が入る "A","C#","E"など）
      }
    }

    //トライアドとセブンスに色を付けるためのClassをクリア
    $(".flet-cell").removeClass("root");
    $(".flet-cell").removeClass("third");
    $(".flet-cell").removeClass("fifth");
    $(".flet-cell").removeClass("seventh");

    for (let tone in chord_tone) {

      switch (disp_type) {

        //度数表記か音名表記かで処理を分けている
        case "dosuu":
          $("." + chord_tone[tone]).text(CHORD_CHARACTOR[chord_type][tone]);//音名Classを持つtdに度数を入れる
          break;
        case "onmei":
          $("." + chord_tone[tone]).text(chord_tone[tone].replace("s", "#"));//音名Classを持つtdに絶対音名を入れる
          break;
      }

      //トライアドとセブンスを色分けするためのクラスを付加
      switch (CHORD_DATA[chord_type][tone]) {
        case "root":
          $("." + chord_tone[tone]).addClass("root");
          break;
        case "third":
          $("." + chord_tone[tone]).addClass("third");
          break;
        case "flat3":
          $("." + chord_tone[tone]).addClass("third");
          break;
        case "fifth":
          $("." + chord_tone[tone]).addClass("fifth");
          break;
        case "flat5":
          $("." + chord_tone[tone]).addClass("fifth");
          break;
        case "maj7":
          $("." + chord_tone[tone]).addClass("seventh");
          break;
        case "flat7":
          $("." + chord_tone[tone]).addClass("seventh");
          break;
      }
    }
  }

  //不要なフレット表示のオン・オフ
  $('.flet-on-off').click(function () {
    const className = ".pos-" + $(this).val();
    if ($(this).prop('checked')) {
      $(className).css('visibility', 'visible');

    } else {
      $(className).css('visibility', 'hidden');
    };
  });

  //不要な弦表示のオンオフ
  $('.str-on-off').click(function () {
    const className = ".str" + $(this).val();
    if ($(this).prop('checked')) {
      $(className).css('visibility', 'visible');

    } else {
      $(className).css('visibility', 'hidden');
    };
  });


  //全フレットの一括オン・オフ
  $('.all-on-off').click(function () {
    if ($(this).prop('checked')) {
      $('.flet-cell').css('visibility', 'visible');
      $('.flet-on-off').prop('checked', true);
    } else {
      $('.flet-cell').css('visibility', 'hidden');
      $('.flet-on-off').prop('checked', false);
    };
  });

  //キー入力のチェックと自動補正
  $('#key-input').keyup(function () {
    let input = $(this).val();
    input = input.slice(0, 1).toUpperCase() + input.slice(1, 2);
    $(this).val(input);
    let temp1 = input.slice(0, 1);
    if (!temp1.match(/^[A-G]$/)) {
      $(this).val("");
      return;
    }
    if (input.length === 1) {
      key = $(this).val();
      generateTab(key, chord_type, disp_type);
    }
    temp1 = input.slice(1, 2);
    if (temp1.match(/^[b#]$/)) {
      key = $(this).val().replace("#", "s");
      generateTab(key, chord_type, disp_type);
    } else {
      $(this).val(input.slice(0, 1));
    }
  });

  //コードタイプを選択したらタブを作成
  $('.select-chord-type').change(function () {
    chord_type = $(this).val();
    chord_Name = $(this).data("chordname");
    console.log(chord_Name);
    key = $('#key-input').val().replace("#", "s");
    generateTab(key, chord_type, disp_type);
  });

  //表示形式を選択したらタブを作成
  $('.select-display-type').change(function () {
    disp_type = $(this).val();
    key = $('#key-input').val().replace("#", "s");
    generateTab(key, chord_type, disp_type);
  });

  //PNGでダウンロード
  $('#download').click(function () {
    $('#ChordName').text(key.replace("s", "#")  + chord_Name);//左上にコード（スケール名）を一時的に表示
    html2canvas(document.querySelector("#guitar")).then(canvas => {
      let downloadEle = document.createElement("a");
      downloadEle.href = canvas.toDataURL("image/png");
      const filename = key + chord_Name + ".png";
      downloadEle.download = filename;
      downloadEle.click();
      $('#ChordName').text("");
    });
  });

  //今のフレット図を画像化してキープ
  $('#keep').click(function () {
    html2canvas(document.querySelector("#guitar")).then(canvas => {
      let d = document.createElement("div");
      let h1 = document.createElement("h1");
      h1.textContent = key.replace("s", "#") + chord_Name;
      d.appendChild(h1);
      d.appendChild(canvas);
      d.classList.add("keeped-flet");
      $('#keep_area').append(d);
    });
  });

});
