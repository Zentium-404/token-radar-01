// farm.js — the farm-plan engine the detail view renders.
//
// Everything here is derived from the protocol's own record: its category names the action, its
// chains name the place, its TVL names a realistic position size, its age names the qualifying
// window. No protocol name is special-cased anywhere in this file.
window.FARM = (function () {
  'use strict';

  /** The first chain the record names, or a neutral phrase when none is listed. */
  function chainOf(p) {
    return p.chains && p.chains.length > 0 ? p.chains[0] : 'its main chain';
  }

  /** Position size from the protocol's scale: deeper TVL, larger realistic position. */
  function capitalFor(p) {
    if (p.tvl_usd >= 5e9) return 250;
    if (p.tvl_usd >= 1e9) return 150;
    if (p.tvl_usd >= 1e8) return 100;
    return 50;
  }

  /** Hold window from age: younger protocols need a longer qualifying stretch. */
  function holdDaysFor(age) {
    if (age === null || age === undefined) return 30;
    if (age < 180) return 60;
    if (age < 365) return 45;
    return 30;
  }

  /** The one action the category calls for, in words a reader can follow. */
  function actionFor(p, capital, chain) {
    var c = (p.category || '').toLowerCase();
    var name = p.name;
    if (c.indexOf('lend') >= 0 || c.indexOf('cdp') >= 0 || c.indexOf('collateral') >= 0) {
      return 'Supply $' + capital + ' of USDC to ' + name + ' on ' + chain + ' and keep the position open.';
    }
    if (c.indexOf('dex') >= 0 || c.indexOf('yield') >= 0 || c.indexOf('leveraged farm') >= 0) {
      return 'Provide $' + capital + " of liquidity to " + name + "'s main pool on " + chain + ' and keep the position open.';
    }
    if (c.indexOf('bridge') >= 0) {
      return 'Bridge $' + capital + ' of USDC to ' + chain + ' through ' + name + ' and use the bridged funds in its app.';
    }
    if (c.indexOf('staking') >= 0 || c.indexOf('restak') >= 0) {
      return 'Stake $' + capital + " of the chain's staking asset through " + name + ' and keep the receipt.';
    }
    if (c.indexOf('perpetual') >= 0 || c.indexOf('derivative') >= 0) {
      return 'Deposit $' + capital + ' of USDC as margin on ' + name + ' and open one small hedge.';
    }
    if (c.indexOf('prediction') >= 0) {
      return 'Fund $' + capital + ' and place one market position on ' + name + '.';
    }
    if (c.indexOf('curator') >= 0 || c.indexOf('allocator') >= 0) {
      return 'Deposit $' + capital + ' into a ' + name + ' vault on ' + chain + ' and keep the shares.';
    }
    if (c.indexOf('stable') >= 0) {
      return 'Mint or deposit $' + capital + ' of the stable asset through ' + name + ' on ' + chain + '.';
    }
    if (c.indexOf('rwa') >= 0) {
      return 'Mint $' + capital + " of the protocol's yield asset on " + chain + ' and hold it.';
    }
    if (c.indexOf('insurance') >= 0) {
      return 'Buy $' + capital + ' of cover from ' + name + ' on ' + chain + ' and keep the policy.';
    }
    return 'Deposit $' + capital + ' of USDC into ' + name + ' on ' + chain + ' and keep the position open.';
  }

  /** The six steps: action, cost, time — all from the record. */
  function buildPlan(p) {
    var chain = chainOf(p);
    var capital = capitalFor(p);
    var hold = holdDaysFor(p.age_days);
    var gas = capital >= 150 ? 8 : 4;
    return [
      {
        text: 'Open a fresh wallet that will hold only the funds you plan to farm here, and keep its seed phrase offline.',
        cost: 'under $3 of gas for the first transaction',
        time: '5 minutes'
      },
      { text: actionFor(p, capital, chain), cost: '$' + capital + ' of capital and about $' + gas + ' of gas', time: '15 minutes to set up' },
      { text: 'Come back once a week and make one qualifying action: a deposit, a borrow, a swap or a vote.', cost: 'about $2 of gas a week', time: '10 minutes a week' },
      { text: 'Leave the position in place for at least ' + hold + ' days, so your activity spans more than one snapshot.', cost: 'the $' + capital + ' stays in the position', time: hold + ' days' },
      { text: "Before withdrawing, read the protocol's own points or rewards page and claim only from a link it publishes.", cost: 'no fee to check, and never pay to claim', time: '10 minutes' },
      { text: 'Record the wallet, the dates and every transaction in a farm log, so the position can be repeated or unwound.', cost: 'nothing but the log', time: '5 minutes' }
    ];
  }

  /** One step as a single gate-shaped string: 20..600 characters. */
  function stepText(step) {
    var s = step.text + ' Cost: ' + step.cost + '. Time: ' + step.time + '.';
    if (s.length > 600) s = s.slice(0, 596) + '...';
    if (s.length < 20) s = s + ' Hold the position and check the protocol page.';
    return s;
  }

  /** The plan as the list of strings board.json's farm_steps carries. */
  function planStrings(p) {
    return buildPlan(p).map(stepText);
  }

  /** Short reader notes on risk, derived from the record, never from a name list. */
  function notes(p, implied) {
    var bits = [];
    var age = p.age_days;
    if (age !== null && age !== undefined && age < 180) {
      bits.push('This protocol is young: ' + age + ' days since its first tracking, so expect thin history and moving incentives.');
    } else {
      bits.push('This protocol has a track record: ' + (age === null || age === undefined ? 'an unreported' : age) + ' days of history.');
    }
    if (p.change_7d !== null && p.change_7d < -20) {
      bits.push('TVL fell ' + Math.abs(p.change_7d).toFixed(1) + '% in the last seven days: check whether capital is leaving before you commit.');
    } else if (p.change_7d !== null && p.change_7d > 40) {
      bits.push('TVL grew ' + p.change_7d.toFixed(1) + '% in the last seven days: growth this fast often means mercenary capital.');
    }
    bits.push('The implied value $' + Math.round(implied).toLocaleString('en-US') + ' is the model estimate for the business as it stands, not a promise of a token or a price.');
    return bits.join(' ');
  }

  /** Render the plan panel: ordered steps with cost and time chips, then the notes block. */
  function renderPlan(el, row) {
    var steps = buildPlan(row);
    var ol = document.createElement('ol');
    ol.className = 'plan-steps';
    steps.forEach(function (s) {
      var li = document.createElement('li');
      var body = document.createElement('div');
      body.className = 'plan-step-body';
      var t = document.createElement('div');
      t.className = 'plan-step-text';
      t.textContent = s.text;
      var meta = document.createElement('div');
      meta.className = 'plan-step-meta';
      var c = document.createElement('span');
      c.className = 'plan-chip cost';
      c.textContent = s.cost;
      var tm = document.createElement('span');
      tm.className = 'plan-chip';
      tm.textContent = s.time;
      meta.appendChild(c);
      meta.appendChild(tm);
      body.appendChild(t);
      body.appendChild(meta);
      li.appendChild(body);
      ol.appendChild(li);
    });
    var notesBlock = document.createElement('div');
    notesBlock.className = 'plan-notes';
    notesBlock.textContent = notes(row, row.implied_value_usd);
    el.appendChild(ol);
    el.appendChild(notesBlock);
  }

  return { buildPlan: buildPlan, stepText: stepText, planStrings: planStrings, notes: notes, renderPlan: renderPlan, capitalFor: capitalFor, holdDaysFor: holdDaysFor, actionFor: actionFor, chainOf: chainOf };
})();
