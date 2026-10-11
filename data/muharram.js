/* =========================================================================
   AIAT — data/muharram.js
   Two lists:
   - upcoming: the coming Muharram's ten nights (schedule + livestream times)
   - recorded: last Muharram's ten nights (topics + recordings)

   HOW TO EDIT
   - topic:      the night's topic, as it should be shown
   - date:       "YYYY-MM-DD" once confirmed (otherwise the expected date is
                 calculated from the Hijri calendar and labelled "expected")
   - time:       start time in Pakistan time, e.g. "21:00"
   - liveStart / liveEnd: livestream window, e.g. "2027-06-06T21:00"
   - youtubeId:  the part after "v=" in a YouTube link, e.g. "dQw4w9WgXcQ"
   - photo:      e.g. "images/muharram-1448-night-1.webp" (+ photoAlt)
   Leave anything unknown as "". Nothing empty is shown.
   ========================================================================= */
window.AIAT = window.AIAT || {};

(function () {
  function tenNights(fields) {
    var list = [];
    for (var n = 1; n <= 10; n++) {
      var night = { night: n };
      for (var k in fields) night[k] = fields[k];
      list.push(night);
    }
    return list;
  }

  AIAT.muharram = {
    upcoming: {
      hijriYear: 1449,
      // TODO: fill in topic/time/live window for each night when announced
      nights: tenNights({ date: "", time: "", topic: "", liveStart: "", liveEnd: "" })
    },
    recorded: {
      hijriYear: 1448,
      // TODO: topics and YouTube IDs for last year's nights
      nights: tenNights({ date: "", topic: "", youtubeId: "", photo: "", photoAlt: "" })
    }
  };
})();
